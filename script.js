document.addEventListener("DOMContentLoaded" ,()=>{


    let b = document.getElementById("sub");

    b.addEventListener("click" , ()=>{
        let email = document.getElementById("email").value;
        let Password = document.getElementById("pass").value;

        fetch("http://localhost:3000/user/login"  , {
            method:"post",
            body:JSON.stringify({email , Password}),
            headers:{
                // token : 
                "Content-Type": "application/json",
            }
        }).then((res)=> res.json())
        .then(data =>{
            localStorage.setItem("token" , data.token)
            window.location.replace("/home.html")
        })
    })
})