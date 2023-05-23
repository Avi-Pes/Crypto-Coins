"use strict"

function alertError(error = "") {
    if (!error) {
        error = "Seems like there is a problem with the server"
    }
    Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: `${error}`,
    })

}


