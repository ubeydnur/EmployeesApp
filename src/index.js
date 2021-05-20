import { Request } from './requests'
import { UI } from './ui'

const form = document.getElementById('employee-form');
const nameInput = document.getElementById('name')
const departmentInput = document.getElementById('department')
const salaryInput = document.getElementById('salary')
const employeesList = document.getElementById('employees')
const updateEmployeeBtn = document.getElementById('update')

const request = new Request('http://localhost:3000/employees')
const ui = new UI()

let updateState = null

eventListeners()

function eventListeners() {
    document.addEventListener('DOMContentLoaded', getAllEmployees)
    form.addEventListener('submit', addEmployee)
    employeesList.addEventListener('click', updateOrDelete)
    updateEmployeeBtn.addEventListener('click', updateEmployee)
}

function getAllEmployees() {
    request.get()
        .then(employees => {
            ui.addAllEmployeeToUI(employees)
        })
        .catch(err => console.error(err))
}

function addEmployee(e) {
    const employeeName = nameInput.value.trim()
    const employeeDepartment = departmentInput.value.trim()
    const employeeSalary = salaryInput.value.trim()

    if (employeeName === "" || employeeDepartment === "" || employeeSalary === "") {
        alert("Lütfen tüm alanları doldurun !!!")
    } else {
        request.post({
            name: employeeName,
            department: employeeDepartment,
            salary: Number(employeeSalary)
        })
            .then(employee => ui.addEmployeeToUI(employee))
            .catch(err => console.log(err))
    }

    ui.clearInputs()

    e.preventDefault()
}

function updateOrDelete(e) {
    if (e.target.id === "delete-employee") {
        //Delete
        deleteEmployee(e.target)
    } else if (e.target.id === "update-employee") {
        //Update
        updateEmployeeController(e.target.parentElement.parentElement)

    }
}

function deleteEmployee(targetEmployee) {
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent

    request.delete(id)
        .then(message => ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement))
        .catch(err => console.log(err))
}

function updateEmployeeController(targetEmployee) {
    ui.toggleUpdateBtn(targetEmployee)

    if (updateState === null) {
        updateState = {
            updateId: targetEmployee.children[0].textContent,
            updateParent: targetEmployee
        }
    } else {
        updateState = null
    }
}

function updateEmployee(e) {
    if (updateState) {
        //Update
        const data = {
            name: nameInput.value.trim(),
            department: departmentInput.value.trim(),
            salary: Number(salaryInput.value.trim())
        }

        request.put(updateState.updateId, data)
            .then(updatedEmployee => {
                ui.updateEmployeeOnUI(updatedEmployee, updateState.updateParent)
                updateState = null;
            })
            .catch(err => console.log(err))

    }
    e.preventDefault();
}
