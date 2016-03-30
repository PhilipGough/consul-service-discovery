function getRandomNumber(){
     $.ajax({
        type: "GET",
        url: '/number'
   });
}
