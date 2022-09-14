
let SelectedRow = null;
document.addEventListener("DOMContentLoaded", ()=>{
    return axios.get("http://localhost:3000/student")
            .then(resp=>{
               let stdData = resp.data
           stdData.sort((a, b) => {
                return b.score - a.score;
                    });

            let scoreArr =[]
               stdData.map((item, index)=>{            
              let tr = document.createElement("tr")
              tr.innerHTML = `
              <th scope="row">${index+1}</th>
              <th scope="row">${item.adm}</th>
                <td>${item.fname}</td>
                <td>${item.lname}</td>
                <td>${item.score}</td>
                <td><a href="#form" onclick="editBtn(this);" type="button" id="${item.id}" class="update btn btn-outline-success">edit</a></td>
                <td><button onclick="deleteBtn(this);" type="button" id="${item.id}"  class="delete btn btn-outline-danger">delete</button></td>
            
              `
            
              document.getElementById("tBody").appendChild(tr)
               scoreArr.push(Number(item.score))

               })

               let totalSum = 0;
               for(let i in scoreArr) {
                totalSum += scoreArr[i]
               
            }
            document.getElementById("mean-value").textContent= totalSum/scoreArr.length


            
            
            })        
})


let form = document.querySelector("#form")
form.addEventListener("submit", collectData)

let data = new FormData(form);
function collectData(e) {
    e.preventDefault();

if(SelectedRow==null)
{
    const { admNo, fname , lname, score } = this.elements;
    axios.post("http://localhost:3000/student", {
    adm: admNo.value, 
    fname: fname.value,
    lname: lname.value,
    score: score.value
}).then(res=>{
    alert("details submitted sucessfully")
}) 
}else{
return;
}


       
}

// fetch best performances 

axios.get("http://localhost:3000/student").then(res=>{
    let passed = res.data;
    passed.sort((a, b) => {
        return b.score - a.score;
            });

    passed.map((item,index)=>{
        if(item.score>80) {
            let tr = document.createElement("tr")
            tr.innerHTML = `
            <th scope="row">${index+1}</th>
            <th scope="row">${item.adm}</th>
              <td>${item.fname}</td>
              <td>${item.lname}</td>
              <td>${item.score}</td>
            `

            document.getElementById("tPass").appendChild(tr)
              
        }
    })
})

// delete btn
function deleteBtn(tr) {
    if(confirm("are you sure you want to delete?")){
        tr.parentNode.parentNode.remove()
        axios.delete(`http://localhost:3000/student/${tr.id}`).then(res=>alert("student delete successfully"))
    }else {
        return;
    }
}

//edit data

function editBtn(btn) {
    SelectedRow=btn.parentNode.parentNode
    
    document.getElementById("adm-no").value = SelectedRow.cells[1].innerHTML
    document.getElementById("fname").value = SelectedRow.cells[2].innerHTML
    document.getElementById("lname").value = SelectedRow.cells[3].innerHTML
    document.getElementById("math-score").value = SelectedRow.cells[4].innerHTML
    let update = document.createElement("btn")
    update.innerHTML= `<button onclick="updateData(this)" id="${btn.id}" class="btn btn-success">update</button>`
    document.getElementById("form").appendChild(update)
    document.getElementById("first").remove()

}


//update function
function updateData (edit){
    let newAdm = document.getElementById("adm-no").value
    let newFname= document.getElementById("fname").value
    let newLname= document.getElementById("lname").value
    let newScore= document.getElementById("math-score").value
return axios.patch(`http://localhost:3000/student/${edit.id}`, {
    adm: newAdm,
    fname: newFname,
    lname: newLname,
    score: newScore,
}).then(res=>confirm(`are you sure you want to update data on id: ${res.data.adm}`)

)
}

