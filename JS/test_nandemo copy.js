{
  document.querySelectorAll(".public-DraftStyleDefault-block a")
    .forEach(function(aTag){
      aTag.addEventListener("click", function(event){
        event.preventDefault();
        console.log("リンクがクリックされました");
      })
    })
}