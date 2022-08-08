// const ducks = [
//   {
//     _id: 1,
//     duckName: 'Tom',
//     duckHabitat: 'Pond',
//     duckAge: 75,
//     duckGender: 'Male',
//   },
//   {
//     _id: 2,
//     duckName: 'Erin',
//     duckHabitat: 'Lake',
//     duckAge: 35,
//     duckGender: 'Female',
//   },
// ]

let selectDuckId = null
// need to know whether updated or saved to table

function closeDuckModal() {
  const modalElement = document.getElementById('userModal')
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()

  document.getElementById('duckName').value = ''
  document.getElementById('duckHabitat').value = ''
  document.getElementById('duckAge').value = ''
  document.getElementById('duckGender').value = ''
  // Removes data from input fields

  document.getElementById('submitBtn').innerHTML = 'Save' // returns update button from update to save in modal
  selectDuckId = null
}

function submitForm() {
  if (!selectDuckId) saveDuck()
  else updateDuck()
}

// CREATE FUNCTION
function writeDuckRow(duck) {
  const duckUpdate = encodeURIComponent(JSON.stringify(duck))
  return `
          <tr id="row-${duck._id}">
              <td>${duck._id}</td>
              <td>${duck.duckName}</td>
              <td>${duck.duckHabitat}</td>
              <td>${duck.duckAge}</td>
              <td>${duck.duckGender}</td>
              <td class="w-25">
               <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#userModal" onclick="fillFormForUpdate('${duckUpdate}')">Update</button>
               <button class="btn btn-danger" onclick="deleteDuck('${duck._id}')">Delete</button>
              </td>
         </tr>


`
}

function fillFormForUpdate(duckPayload) {
  document.getElementById('submitBtn').innerHTML = 'Update'
  const duck = JSON.parse(decodeURIComponent(duckPayload))

  document.getElementById('duckName').value = duck.duckName
  document.getElementById('duckHabitat').value = duck.duckHabitat
  document.getElementById('duckAge').value = duck.duckAge
  document.getElementById('duckGender').value = duck.duckGender
  // adds data from saved input to modal fields

  selectDuckId = duck._id
}

// SAVE FUNCTION
async function saveDuck() {
  const duckName = document.getElementById('duckName').value
  const duckHabitat = document.getElementById('duckHabitat').value
  const duckAge = document.getElementById('duckAge').value
  const duckGender = document.getElementById('duckGender').value

  const { data } = await axios.post(
    'http://localhost:8080/swagger-ui/index.html#/duck-controller/createDuck',
    { duckName, duckHabitat, duckAge, duckGender }
  )

  const duck = {
    _id: data._id,
    duckName,
    duckHabitat,
    duckAge,
    duckGender,
  }

  const appendData = writeDuckRow(duck)

  const tableBody = document.getElementById('table-body')
  tableBody.innerHTML += appendData

  closeDuckModal()
}

// UPDATE FUNCTION
async function updateDuck() {
  const duckName = document.getElementById('duckName').value
  const duckHabitat = document.getElementById('duckHabitat').value
  const duckAge = document.getElementById('duckAge').value
  const duckGender = document.getElementById('duckGender').value

  await axios({
    method: 'put',
    url:
      'http://localhost:8080/swagger-ui/index.html#/duck-controller/updateDuck/' +
      selectDuckId,
    data: { duckName, duckHabitat, duckAge, duckGender },
  })

  const duckNameField = document.querySelector(
    '#row-' + selectDuckId + ' td:nth-child(2)'
  )
  const duckHabitatField = document.querySelector(
    '#row-' + selectDuckId + ' td:nth-child(3)'
  )
  const duckAgeField = document.querySelector(
    '#row-' + selectDuckId + ' td:nth-child(4)'
  )
  const duckGenderField = document.querySelector(
    '#row-' + selectDuckId + ' td:nth-child(5)'
  )
  const updateButtonField = document.querySelector(
    '#row-' + selectDuckId + ' td:nth-child(6) button:nth-child(1)'
  )

  const duckUpdate = encodeURIComponent(
    JSON.stringify({ _id: duckName, duckHabitat, duckAge, duckGender })
  )

  updateButtonField.setAttribute(
    'onclick',
    'fillFormForUpdate("' + duckUpdate + '")'
  )

  duckNameField.innerHTML = duckName
  duckHabitatField.innerHTML = duckHabitat
  duckAgeField.innerHTML = duckAge
  duckGenderField.innerHTML = duckGender

  closeDuckModal()
}

// DELETE FUNCTION
async function deleteDuck(_id) {
  await axios.delete(
    'http://localhost:8080/swagger-ui/index.html#/duck-controller/deleteDuck' +
      _id
  )
  const duckElement = document.getElementById('row-' + _id)
  duckElement.remove()
}

async function loadDucks() {
  let tableBodyContent = ''

  const { data: ducks } = await axios.get(
    'http://localhost:8080/swagger-ui/index.html#/duck-controller/readAllDucks'
  )

  ducks.forEach((duck) => (tableBodyContent += writeDuckRow(duck)))

  const tableBody = document.getElementById('table-body')
  tableBody.innerHTML = tableBodyContent
}

loadDucks()
