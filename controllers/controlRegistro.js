// Datos de estudiantes (simulación) con 30 alumnos divididos en tres grupos
const students = [
  // Grupo A (10 estudiantes)
  { id: 1, name: "Ana García", email: "ana@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 2, name: "Carlos López", email: "carlos@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 3, name: "María Rodríguez", email: "maria@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 4, name: "Alfredo Ruiz", email: "alfredo@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 5, name: "Beatriz Castillo", email: "beatriz@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 6, name: "David Fernández", email: "david@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 7, name: "Elena Morales", email: "elena@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 8, name: "Fernando Jiménez", email: "fernando@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 9, name: "Gabriela Torres", email: "gabriela@ejemplo.com", group: "Grupo A", attendance: "No registrado" },
  { id: 10, name: "Hugo Martínez", email: "hugo@ejemplo.com", group: "Grupo A", attendance: "No registrado" },

  // Grupo B (10 estudiantes)
  { id: 11, name: "Isabel Soto", email: "isabel@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 12, name: "Javier Ramírez", email: "javier@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 13, name: "Karla Mendoza", email: "karla@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 14, name: "Luis Gómez", email: "luis@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 15, name: "Marta Díaz", email: "marta@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 16, name: "Nicolás Ortega", email: "nicolas@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 17, name: "Olga Castillo", email: "olga@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 18, name: "Pablo Campos", email: "pablo@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 19, name: "Queralt Fernández", email: "queralt@ejemplo.com", group: "Grupo B", attendance: "No registrado" },
  { id: 20, name: "Raúl Vázquez", email: "raul@ejemplo.com", group: "Grupo B", attendance: "No registrado" },

  // Grupo C (10 estudiantes)
  { id: 21, name: "Sara Muñoz", email: "sara@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 22, name: "Tomás Blanco", email: "tomas@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 23, name: "Úrsula Peña", email: "ursula@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 24, name: "Valeria Vega", email: "valeria@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 25, name: "Walter Silva", email: "walter@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 26, name: "Ximena Rocha", email: "ximena@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 27, name: "Yolanda Reyes", email: "yolanda@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 28, name: "Zacarías León", email: "zacarias@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 29, name: "Oscar Medina", email: "oscar@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
  { id: 30, name: "Renata Gómez", email: "renata@ejemplo.com", group: "Grupo C", attendance: "No registrado" },
];

// Estado asistencia en memoria inicializado
const attendanceStates = {};
students.forEach(s => attendanceStates[s.id] = 'No registrado');

// Referencias DOM
const tbody = document.getElementById('studentsTbody');
const searchInput = document.getElementById('searchInput');
const filterForm = document.getElementById('filterForm');

// Crear nuevo select alfabético (A-Z + Todos)
const filterRow = filterForm.querySelector('.filter-row');

const filterAlphaDiv = document.createElement('div');
filterAlphaDiv.className = 'filter-field';

const labelAlpha = document.createElement('label');
labelAlpha.setAttribute('for', 'alphaSelect');
labelAlpha.textContent = 'Inicial';

const selectAlpha = document.createElement('select');
selectAlpha.id = 'alphaSelect';
selectAlpha.name = 'alpha';

const alphaOptions = ['Todos', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

alphaOptions.forEach(letter => {
  const option = document.createElement('option');
  option.value = letter === 'Todos' ? '' : letter;
  option.textContent = letter;
  // Solo agregar al select, no al div padre
  selectAlpha.appendChild(option);
});

filterAlphaDiv.appendChild(labelAlpha);
filterAlphaDiv.appendChild(selectAlpha);

// Insertar select de filtro alfabético antes del botón filtrar
// Para mejor visualización, insertarlo antes del botón filtrar o al final
filterRow.insertBefore(filterAlphaDiv, filterRow.lastElementChild);

// Modificar renderTable para incluir filtro alfabético
function renderTable(filter = {}) {
  tbody.innerHTML = '';

  const searchText = (filter.search || '').toLowerCase();
  const selectedMateria = filter.materia || 'Matemáticas';
  const selectedGrupo = filter.grupo || 'Grupo A';
  const selectedAlpha = (filter.alpha || '').toUpperCase();

  let filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText) || student.email.toLowerCase().includes(searchText);
    const matchesGroup = student.group === selectedGrupo;
    const matchesAlpha = selectedAlpha === '' || student.name.toUpperCase().startsWith(selectedAlpha);
    // No se filtra por materia dado que no está implementado en datos
    return matchesSearch && matchesGroup && matchesAlpha;
  });

  filteredStudents.forEach(student => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', student.id);

    // Colorear fila según estado de asistencia
    const studentStatus = attendanceStates[student.id];
    if (studentStatus === "Ausente") {
      // Clase para ausente (rojo)
      tr.classList.add("table-danger");
    } else if (studentStatus === "Justificado") {
      // Clase para justificado (amarillo)
      tr.classList.add("table-warning");
    }

    // Columna estudiante
    const tdName = document.createElement('td');
    const divStudentInfo = document.createElement('div');
    divStudentInfo.className = "student-info";
    const spanName = document.createElement('span');
    spanName.className = 'student-name';
    spanName.textContent = student.name;
    const spanEmail = document.createElement('span');
    spanEmail.className = 'student-email';
    spanEmail.textContent = student.email;
    divStudentInfo.appendChild(spanName);
    divStudentInfo.appendChild(spanEmail);
    tdName.appendChild(divStudentInfo);

    // Columna grupo
    const tdGroup = document.createElement('td');
    tdGroup.className = 'student-group';
    const [grpText, grpLetter] = student.group.split(' ');
    tdGroup.innerHTML = `${grpText} <strong>${grpLetter}</strong>`;

    // Columna estado
    const tdStatus = document.createElement('td');
    const statusText = attendanceStates[student.id] || "No registrado";

    if (statusText === "No registrado") {
      const spanStatus = document.createElement('span');
      spanStatus.className = 'status-unregistered';
      spanStatus.textContent = "No registrado";
      spanStatus.setAttribute('aria-label', 'Estado de asistencia no registrado');
      tdStatus.appendChild(spanStatus);
    } else {
      const spanStatus = document.createElement('span');
      spanStatus.textContent = statusText;
      spanStatus.className = {
        'Presente': 'btn-present',
        'Ausente': 'btn-absent',
        'Justificado': 'btn-justified'
      }[statusText] || '';
      tdStatus.appendChild(spanStatus);
    }

    // Columna acciones
    const tdActions = document.createElement('td');
    tdActions.className = 'actions-cell';

    // Botones estado
    const btnPresent = document.createElement('button');
    btnPresent.className = 'btn-status btn-present';
    btnPresent.type = 'button';
    btnPresent.textContent = 'Presente';
    btnPresent.setAttribute('aria-pressed', attendanceStates[student.id] === 'Presente' ? 'true' : 'false');
    btnPresent.setAttribute('aria-label', `Marcar ${student.name} como presente`);

    const btnAbsent = document.createElement('button');
    btnAbsent.className = 'btn-status btn-absent';
    btnAbsent.type = 'button';
    btnAbsent.textContent = 'Ausente';
    btnAbsent.setAttribute('aria-pressed', attendanceStates[student.id] === 'Ausente' ? 'true' : 'false');
    btnAbsent.setAttribute('aria-label', `Marcar ${student.name} como ausente`);

    const btnJustified = document.createElement('button');
    btnJustified.className = 'btn-status btn-justified';
    btnJustified.type = 'button';
    btnJustified.textContent = 'Justificado';
    btnJustified.setAttribute('aria-pressed', attendanceStates[student.id] === 'Justificado' ? 'true' : 'false');
    btnJustified.setAttribute('aria-label', `Marcar ${student.name} como justificado`);

    btnPresent.addEventListener('click', () => {
      updateAttendance(student.id, 'Presente');
    });
    btnAbsent.addEventListener('click', () => {
      updateAttendance(student.id, 'Ausente');
    });
    btnJustified.addEventListener('click', () => {
      updateAttendance(student.id, 'Justificado');
    });

    tdActions.appendChild(btnPresent);
    tdActions.appendChild(btnAbsent);
    tdActions.appendChild(btnJustified);

    tr.appendChild(tdName);
    tr.appendChild(tdGroup);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });

  if (filteredStudents.length === 0) {
    const trEmpty = document.createElement('tr');
    const tdEmpty = document.createElement('td');
    tdEmpty.colSpan = 4;
    tdEmpty.style.textAlign = 'center';
    tdEmpty.style.padding = '1.2rem';
    tdEmpty.style.color = '#666';
    tdEmpty.textContent = 'No se encontraron estudiantes para los criterios seleccionados.';
    trEmpty.appendChild(tdEmpty);
    tbody.appendChild(trEmpty);
  }
}

// Cambiar estado de asistencia y volver a renderizar
function updateAttendance(studentId, status) {
  attendanceStates[studentId] = status;
  renderTable(getCurrentFilters());
}

function getCurrentFilters() {
  return {
    search: searchInput.value.trim(),
    materia: document.getElementById('materiaSelect').value,
    grupo: document.getElementById('grupoSelect').value,
    fecha: document.getElementById('fechaInput').value,
    alpha: document.getElementById('alphaSelect').value,
  };
}

// Eventos
filterForm.addEventListener('submit', e => {
  e.preventDefault();
  renderTable(getCurrentFilters());
});
searchInput.addEventListener('input', () => {
  renderTable(getCurrentFilters());
});
document.getElementById('grupoSelect').addEventListener('change', () => {
  // Limpiar búsqueda y filtro alfabético cuando cambia grupo para mejor UX
  searchInput.value = '';
  selectAlpha.value = '';
  renderTable(getCurrentFilters());
});
selectAlpha.addEventListener('change', () => {
  renderTable(getCurrentFilters());
});

// Iniciar tabla
renderTable(getCurrentFilters());
