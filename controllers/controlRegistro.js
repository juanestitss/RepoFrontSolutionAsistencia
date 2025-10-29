function checkSession() {
  const session = localStorage.getItem('currentSession');
  if (!session) {
    alert('⚠️ Debes iniciar sesión para acceder a esta página');
    window.location.href = './logIn.html';
    return false;
  }
  
  const sessionData = JSON.parse(session);
  console.log('Usuario actual:', sessionData.username);
  return true;
}

// Verificar sesión al cargar
if (!checkSession()) {
  throw new Error('Sesión no válida');
}

// DATOS DE ESTUDIANTES
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

// MANEJO DE LOCALSTORAGE PARA ASISTENCIA
let hasUnsavedChanges = false; // Control de cambios sin guardar

// Función para obtener la clave de localStorage según filtros actuales
function getStorageKey() {
  const materia = document.getElementById('materiaSelect').value;
  const grupo = document.getElementById('grupoSelect').value;
  const fecha = document.getElementById('fechaInput').value || 'sin-fecha';
  return `attendance_${materia}_${grupo}_${fecha}`;
}

// Cargar estados de asistencia desde localStorage
function loadAttendanceFromStorage() {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  if (saved) {
    const data = JSON.parse(saved);
    console.log('✓ Asistencia cargada desde localStorage:', key);
    return data;
  }
  return {};
}

// Guardar estados de asistencia en localStorage
function saveAttendanceToStorage(attendanceStates) {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(attendanceStates));
  console.log('✓ Asistencia guardada en localStorage:', key);
  hasUnsavedChanges = false;
  updateActionButtons();
}

// Borrar asistencia del localStorage
function deleteAttendanceFromStorage() {
  const key = getStorageKey();
  localStorage.removeItem(key);
  console.log('🗑️ Asistencia eliminada del localStorage:', key);
}

// Estado de asistencia inicializado desde localStorage
let attendanceStates = loadAttendanceFromStorage();

// Inicializar estados para estudiantes que no tienen registro
students.forEach(s => {
  if (!attendanceStates[s.id]) {
    attendanceStates[s.id] = 'No registrado';
  }
});

// REFERENCIAS DOM
const tbody = document.getElementById('studentsTbody');
const searchInput = document.getElementById('searchInput');
const filterForm = document.getElementById('filterForm');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');

// CREAR BOTONES DE ACCIÓN (GUARDAR, DESHACER, BORRAR)
function createActionButtons() {
  const filterBox = document.querySelector('.filter-box');
  
  const actionContainer = document.createElement('div');
  actionContainer.style.cssText = `
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  `;
  
  //BOTÓN GUARDAR
  const saveButton = document.createElement('button');
  saveButton.id = 'saveButton';
  saveButton.type = 'button';
  saveButton.innerHTML = '💾 Guardar Cambios';
  saveButton.style.cssText = `
    background-color: #10b981;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  //BOTÓN DESHACER
  const undoButton = document.createElement('button');
  undoButton.id = 'undoButton';
  undoButton.type = 'button';
  undoButton.innerHTML = '↺ Deshacer Cambios';
  undoButton.style.cssText = `
    background-color: #f59e0b;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  // BOTÓN BORRAR REGISTRO 
  const deleteButton = document.createElement('button');
  deleteButton.id = 'deleteButton';
  deleteButton.type = 'button';
  deleteButton.innerHTML = '🗑️ Borrar Registro';
  deleteButton.style.cssText = `
    background-color: #ef4444;
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  // MENSAJE DE ESTADO 
  const statusMessage = document.createElement('span');
  statusMessage.id = 'statusMessage';
  statusMessage.style.cssText = `
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  `;
  
  //  EVENTOS 
  saveButton.addEventListener('click', handleSaveChanges);
  undoButton.addEventListener('click', handleUndoChanges);
  deleteButton.addEventListener('click', handleDeleteRecord);
  
  // Hover effects
  [saveButton, undoButton, deleteButton].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (!btn.disabled) {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
  });
  
  actionContainer.appendChild(saveButton);
  actionContainer.appendChild(undoButton);
  actionContainer.appendChild(deleteButton);
  actionContainer.appendChild(statusMessage);
  filterBox.appendChild(actionContainer);
}

// ACTUALIZAR ESTADO DE BOTONES
function updateActionButtons() {
  const saveButton = document.getElementById('saveButton');
  const undoButton = document.getElementById('undoButton');
  const deleteButton = document.getElementById('deleteButton');
  const statusMessage = document.getElementById('statusMessage');
  
  if (!saveButton) return;
  
  // Estado del botón GUARDAR
  if (hasUnsavedChanges) {
    saveButton.style.backgroundColor = '#10b981';
    saveButton.disabled = false;
    saveButton.style.opacity = '1';
    undoButton.style.backgroundColor = '#f59e0b';
    undoButton.disabled = false;
    undoButton.style.opacity = '1';
    statusMessage.textContent = '⚠️ Hay cambios sin guardar';
    statusMessage.style.color = '#f59e0b';
  } else {
    saveButton.style.backgroundColor = '#9ca3af';
    saveButton.disabled = true;
    saveButton.style.opacity = '0.6';
    undoButton.style.backgroundColor = '#9ca3af';
    undoButton.disabled = true;
    undoButton.style.opacity = '0.6';
    statusMessage.textContent = '✓ Todos los cambios guardados';
    statusMessage.style.color = '#10b981';
  }
  
  // Estado del botón BORRAR (siempre disponible si hay datos guardados)
  const hasStoredData = localStorage.getItem(getStorageKey()) !== null;
  if (hasStoredData) {
    deleteButton.style.backgroundColor = '#ef4444';
    deleteButton.disabled = false;
    deleteButton.style.opacity = '1';
  } else {
    deleteButton.style.backgroundColor = '#9ca3af';
    deleteButton.disabled = true;
    deleteButton.style.opacity = '0.6';
  }
}

// MANEJAR GUARDAR CAMBIOS
function handleSaveChanges() {
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');
  
  saveButton.innerHTML = '⏳ Guardando...';
  saveButton.disabled = true;
  
  setTimeout(() => {
    saveAttendanceToStorage(attendanceStates);
    
    saveButton.innerHTML = '✓ Guardado';
    saveButton.style.backgroundColor = '#059669';
    statusMessage.textContent = '✓ Cambios guardados exitosamente';
    statusMessage.style.color = '#10b981';
    
    setTimeout(() => {
      saveButton.innerHTML = '💾 Guardar Cambios';
      updateActionButtons();
    }, 2000);
  }, 500);
}

// MANEJAR DESHACER CAMBIOS

function handleUndoChanges() {
  if (!confirm('⚠️ ¿Deseas deshacer todos los cambios no guardados? Esta acción restaurará los datos del último guardado.')) {
    return;
  }
  
  const undoButton = document.getElementById('undoButton');
  const statusMessage = document.getElementById('statusMessage');
  
  undoButton.innerHTML = '⏳ Restaurando...';
  undoButton.disabled = true;
  
  setTimeout(() => {
    // Recargar desde localStorage
    attendanceStates = loadAttendanceFromStorage();
    
    // Reinicializar estados
    students.forEach(s => {
      if (!attendanceStates[s.id]) {
        attendanceStates[s.id] = 'No registrado';
      }
    });
    
    hasUnsavedChanges = false;
    renderTable(getCurrentFilters());
    
    undoButton.innerHTML = '✓ Restaurado';
    undoButton.style.backgroundColor = '#059669';
    statusMessage.textContent = '✓ Cambios restaurados desde el último guardado';
    statusMessage.style.color = '#10b981';
    
    setTimeout(() => {
      undoButton.innerHTML = '↺ Deshacer Cambios';
      updateActionButtons();
    }, 2000);
  }, 500);
}

// MANEJAR BORRAR REGISTRO
function handleDeleteRecord() {
  const materia = document.getElementById('materiaSelect').value;
  const grupo = document.getElementById('grupoSelect').value;
  const fecha = document.getElementById('fechaInput').value || 'sin-fecha';
  
  if (!confirm(`⚠️ ¿ESTÁS SEGURO?\n\nEsto eliminará permanentemente el registro de asistencia de:\n• Materia: ${materia}\n• Grupo: ${grupo}\n• Fecha: ${fecha}\n\nEsta acción NO se puede deshacer.`)) {
    return;
  }
  
  const deleteButton = document.getElementById('deleteButton');
  const statusMessage = document.getElementById('statusMessage');
  
  deleteButton.innerHTML = '⏳ Eliminando...';
  deleteButton.disabled = true;
  
  setTimeout(() => {
    // Borrar del localStorage
    deleteAttendanceFromStorage();
    
    // Reiniciar estados a "No registrado"
    students.forEach(s => {
      attendanceStates[s.id] = 'No registrado';
    });
    
    hasUnsavedChanges = false;
    renderTable(getCurrentFilters());
    
    deleteButton.innerHTML = '✓ Eliminado';
    deleteButton.style.backgroundColor = '#7f1d1d';
    statusMessage.textContent = '🗑️ Registro eliminado permanentemente';
    statusMessage.style.color = '#ef4444';
    
    setTimeout(() => {
      deleteButton.innerHTML = '🗑️ Borrar Registro';
      updateActionButtons();
    }, 2000);
  }, 500);
}

// CREAR SELECT ALFABÉTICO

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
  selectAlpha.appendChild(option);
});

filterAlphaDiv.appendChild(labelAlpha);
filterAlphaDiv.appendChild(selectAlpha);
filterRow.insertBefore(filterAlphaDiv, filterRow.lastElementChild);

// CONFIGURAR FECHA MÁXIMA (HOY)

const fechaInput = document.getElementById('fechaInput');
function disableFutureDates() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const maxDate = `${yyyy}-${mm}-${dd}`;
  fechaInput.setAttribute('max', maxDate);
  
  if (!fechaInput.value) {
    fechaInput.value = maxDate;
  }
}
disableFutureDates();

// FUNCIÓN PRINCIPAL: RENDERIZAR TABLA

function renderTable(filter = {}) {
  selectAllCheckbox.checked = false;
  selectAllCheckbox.indeterminate = false;
  tbody.innerHTML = '';

  const searchText = (filter.search || '').toLowerCase();
  const selectedMateria = filter.materia || 'Matemáticas';
  const selectedGrupo = filter.grupo || 'Grupo A';
  const selectedAlpha = (filter.alpha || '').toUpperCase();

  let filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText) || 
                         student.email.toLowerCase().includes(searchText);
    const matchesGroup = student.group === selectedGrupo;
    const matchesAlpha = selectedAlpha === '' || 
                        student.name.toUpperCase().startsWith(selectedAlpha);
    return matchesSearch && matchesGroup && matchesAlpha;
  });

  filteredStudents.forEach(student => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', student.id);

    const studentStatus = attendanceStates[student.id];
    
    if (studentStatus === "Ausente") {
      tr.classList.add("table-danger");
    } else if (studentStatus === "Justificado") {
      tr.classList.add("table-warning");
    }

    const tdCheckbox = document.createElement('td');
    tdCheckbox.className = 'checkbox-cell';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'student-checkbox';
    checkbox.setAttribute('aria-label', `Seleccionar a ${student.name}`);
    checkbox.addEventListener('change', () => {
      tr.classList.toggle('selected', checkbox.checked);
      updateSelectAllCheckboxState();
    });
    tdCheckbox.appendChild(checkbox);

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

    const tdGroup = document.createElement('td');
    tdGroup.className = 'student-group';
    const [grpText, grpLetter] = student.group.split(' ');
    tdGroup.innerHTML = `${grpText} <strong>${grpLetter}</strong>`;

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

    const tdActions = document.createElement('td');
    tdActions.className = 'actions-cell';

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

    tr.appendChild(tdCheckbox);
    tr.appendChild(tdName);
    tr.appendChild(tdGroup);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });

  if (filteredStudents.length === 0) {
    const trEmpty = document.createElement('tr');
    const tdEmpty = document.createElement('td');
    tdEmpty.colSpan = 5;
    tdEmpty.style.textAlign = 'center';
    tdEmpty.style.padding = '1.2rem';
    tdEmpty.style.color = '#666';
    tdEmpty.textContent = 'No se encontraron estudiantes para los criterios seleccionados.';
    trEmpty.appendChild(tdEmpty);
    tbody.appendChild(trEmpty);
  }
}

// ACTUALIZAR ASISTENCIA
function updateAttendance(studentId, status) {
  attendanceStates[studentId] = status;
  hasUnsavedChanges = true;
  updateActionButtons();
  renderTable(getCurrentFilters());
  
  const studentName = students.find(s => s.id === studentId).name;
  console.log(`✓ ${studentName} marcado como: ${status} (sin guardar)`);
}

// OBTENER FILTROS ACTUALES
function getCurrentFilters() {
  return {
    search: searchInput.value.trim(),
    materia: document.getElementById('materiaSelect').value,
    grupo: document.getElementById('grupoSelect').value,
    fecha: document.getElementById('fechaInput').value,
    alpha: document.getElementById('alphaSelect').value,
  };
}

// CHECKBOX "SELECCIONAR TODOS"
function updateSelectAllCheckboxState() {
  const studentCheckboxes = document.querySelectorAll('.student-checkbox');
  const total = studentCheckboxes.length;
  const checkedCount = document.querySelectorAll('.student-checkbox:checked').length;

  if (total === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === total) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

selectAllCheckbox.addEventListener('change', () => {
  const studentCheckboxes = document.querySelectorAll('.student-checkbox');
  studentCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
    checkbox.closest('tr').classList.toggle('selected', selectAllCheckbox.checked);
  });
});

// EVENTOS DE FILTROS
filterForm.addEventListener('submit', e => {
  e.preventDefault();
  renderTable(getCurrentFilters());
});

searchInput.addEventListener('input', () => {
  renderTable(getCurrentFilters());
});

document.getElementById('grupoSelect').addEventListener('change', () => {
  if (hasUnsavedChanges) {
    if (!confirm('⚠️ Tienes cambios sin guardar. ¿Deseas continuar sin guardar?')) {
      return;
    }
  }
  searchInput.value = '';
  selectAlpha.value = '';
  attendanceStates = loadAttendanceFromStorage();
  students.forEach(s => {
    if (!attendanceStates[s.id]) {
      attendanceStates[s.id] = 'No registrado';
    }
  });
  hasUnsavedChanges = false;
  updateActionButtons();
  renderTable(getCurrentFilters());
});

document.getElementById('materiaSelect').addEventListener('change', () => {
  if (hasUnsavedChanges) {
    if (!confirm('⚠️ Tienes cambios sin guardar. ¿Deseas continuar sin guardar?')) {
      return;
    }
  }
  attendanceStates = loadAttendanceFromStorage();
  students.forEach(s => {
    if (!attendanceStates[s.id]) {
      attendanceStates[s.id] = 'No registrado';
    }
  });
  hasUnsavedChanges = false;
  updateActionButtons();
  renderTable(getCurrentFilters());
});

document.getElementById('fechaInput').addEventListener('change', () => {
  if (hasUnsavedChanges) {
    if (!confirm('⚠️ Tienes cambios sin guardar. ¿Deseas continuar sin guardar?')) {
      return;
    }
  }
  attendanceStates = loadAttendanceFromStorage();
  students.forEach(s => {
    if (!attendanceStates[s.id]) {
      attendanceStates[s.id] = 'No registrado';
    }
  });
  hasUnsavedChanges = false;
  updateActionButtons();
  renderTable(getCurrentFilters());
});

selectAlpha.addEventListener('change', () => {
  renderTable(getCurrentFilters());
});

const logoutLink = document.querySelector('.bottom-logout');
if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      if (!confirm('⚠️ Tienes cambios sin guardar. ¿Deseas cerrar sesión de todas formas?')) {
        return;
      }
    }
    if (confirm('¿Deseas cerrar sesión?')) {
      localStorage.removeItem('currentSession');
      window.location.href = './logIn.html';
    }
  });
}
// INICIALIZAR
createActionButtons();
renderTable(getCurrentFilters());
updateActionButtons();