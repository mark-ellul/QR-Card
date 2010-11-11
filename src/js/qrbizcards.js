// global vars
var db = null;

function dataSelectHandler(transaction, results){

if (results.rows.length > 0){
 
         ul   = $("<ul>"); // create the ul element
    var oldlist = $("#main_list_view ul#main_view").detach();  // remove the existing ul
    $("#main_list_view").append(ul); 
    

  for (var i =0; i < results.rows.length; i++) {
  
  var d  = results.rows.item(i);
  $( "#list_tmpl" ).tmpl( d ).appendTo( ul );
  
  }
  
  
  
  ul.listview({
      "inset": true
    });
  
  oldlist.children().appendTo(ul);
}
  
  

}

function insertDataHandler(transaction, results){
    alert("done");

    }


function createTableErrorHandler(transaction, error){

    alert(error + '');
}

function generateQR(){
   $("#generated_qr").show();
    var qr_url = $("#qr_url").val()
    var qr_image = new Image();
    qr_image.onload = function(){

        var canvas = document.getElementById('canv_qr');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(qr_image, 0, 0);

    };

    if (qr_url.toLowerCase().indexOf("http") != 0){
        qr_url = "http://" + qr_url;
    }

    qr_image.src = "http://chart.apis.google.com/chart?cht=qr&chl=" + qr_url + "&chs=172x172"
      
}

function addQRCode(){
    var largest = $(".liqr").length + 1;
    //var canvas = document.getElementById('canv_qr');
    //var ctx = canvas.getContext('2d');
    //var image_content =canvas.toDataURL("image/png");
    var qr_url = $("#qr_url").val();
    var qr_label = $("#qr_label").val();
    var qr_desc = $("#qr_description").val();
    if (qr_url.toLowerCase().indexOf("http") != 0){
        qr_url = "http://" + qr_url;
    }
    var prefix = largest % 10;
    var image_content = "http://"+prefix+".chart.apis.google.com/chart?cht=qr&chl=" + qr_url + "&chs=172x172"

    db.transaction(function(transaction){
        transaction.executeSql("INSERT INTO cards (qr_filename, qr_title, qr_description, card_order) VALUES (?,?, ?, ?);", [image_content, qr_label, qr_desc, largest],
        insertDataHandler, createTableErrorHandler);
    });
}

$(document).ready(
function(){
    if (!window.openDatabase){

        } else{

        // open up the existing cards
        db = openDatabase("qrcards", "1.0", "QRBIZ cards that you have added", 1024 * 1024 * 2);

        db.transaction(function(transaction){
            transaction.executeSql("CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY AUTOINCREMENT unique, qr_filename TEXT NOT NULL, qr_title TEXT NOT NULL, qr_description TEXT, card_order INTEGER);", [],
            dataSelectHandler, createTableErrorHandler);
        });

        db.transaction(function(transaction){
            transaction.executeSql("SELECT * FROM cards ORDER BY card_order;", [],
            dataSelectHandler, createTableErrorHandler);
        });



    }
    //db.executeSql("CREATE TABLE IF NOT EXISTS cards (id unique, image_filename, link_title, label_title, order) ");
    //  db.executeSql("SELECT * FROM cards ORDER BY order", function(result) {
    //
    $("#add_qr").click(function(){
        addQRCode();
    });

    $("#generate_qr").click(function(){
        generateQR();
    });
    
    $("#delete_data").click(function(){
       db.transaction(function(transaction){
            transaction.executeSql("DROP TABLE cards;", [],
            function(t,r){}, createTableErrorHandler);
        });

    });
    
    $(".showqr_href").live("click", function(){
       $("#show_qr_img").attr("src", $(this).parent().parent().children("img").attr("src") );
    });
});


