document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // ambil data
    let nama = document.getElementById("nama").value;
    let email = document.getElementById("email").value;
    let pesan = document.getElementById("pesan").value;

    // validasi sederhana
    if(nama && email && pesan){
        document.getElementById("successMsg").style.display = "block";

        // reset form
        document.getElementById("contactForm").reset();
    }
});