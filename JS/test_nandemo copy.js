{ 
  var aTags = document.querySelectorAll(".public-DraftStyleDefault-block a");
  aTags.forEach(function(aTag){
    aTag.addEventListener("click", function(event){
      event.preventDefault();
      //デプロイ対策でコメント追加
      console.log("リンクがクリックされました");
    })
  });
 }