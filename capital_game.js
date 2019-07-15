
// async function getCSVFromServer() {
// 	const res = await fetch('https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv');
// 	return res.text();
// }

var database = firebase.database();

$(document).ready(function() {
	


$.ajax({
  url: "https://s3.ap-northeast-2.amazonaws.com/cs374-csv/country_capital_pairs.csv",
  
   
})
  .done(function( data ) {
    //if ( console && console.log ) 
    // {
      // console.log( "Sample of data:", data);
      var newLineCountry = data.split('\r\n');
      // create an array where item is a line from data
     // console.log(newLineCountry);
     window.pairs = [];
      // use a for loop to iterate through the line array
      for (var k = 1 ; k < newLineCountry.length ; k++)
      {
      	 var line = newLineCountry[k];
      	 var fields = line.split(',');
      	 
		 const obj = {country: fields[0], capital:fields[1] };
		 window.pairs.push(obj);


      }

      

     
  });







    var country_capital_pairs = window.pairs;
    //console.log(country_capital_pairs);
    var countryMap = new Object();
    var capitalList = []
    for (var i = 0; i < country_capital_pairs.length; i++) {
        countryMap[country_capital_pairs[i]['country']] = country_capital_pairs[i]['capital']
        capitalList.push(country_capital_pairs[i]['capital'])
    }
    var randomCountry = Math.floor(Math.random() * (pairs.length));
    $('.clear').val('');
    document.getElementById("pr2__question").innerHTML = pairs[randomCountry]["country"];
    document.getElementById("pr2__answer").focus();

    $("#pr2__answer").autocomplete({
        source: capitalList,
        minLength: 2
    });


    var answers = [] //set it to stuff you want from the firebase

	// TODO
    // 1. load data from firebase
    var countryEntriesRef = firebase.database().ref('/');
	countryEntriesRef.on('value', function(snapshot) {
	  console.log(snapshot.val());
	var dataJson = snapshot.val();
	var text = '';
	for (key in dataJson) {
	  if (!dataJson.hasOwnProperty(key)) continue;
	  console.log(key);
	  console.log(dataJson[key].country);
	  if (dataJson[key].correct) {
	        text += '<tr style="color:blue"><td>' + dataJson[key].country + ' </td><td>' + dataJson[key].userAnswer + '</td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
	    } else {
	        text += '<tr style="color:red"><td>' + dataJson[key].country + ' </td><td><strike>' + dataJson[key].userAnswer + '</strike>' + '</td><td>' + dataJson[key].correctAnswer + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
	    }
	    var answerEntry = {
            "UserInputCountry": dataJson[key].country,
            "UserInputAnswer": dataJson[key].userAnswer,
            "UserInputCapital": dataJson[key].correctAnswer
        }
        answers.splice(0, 0, answerEntry);

	}
	$("#myTable tbody").html(text)

	

	});
    // 2. display it in the table

    const verifyAnswerAndUploadToFirebase = () => {
    	var UserInputCountry = document.getElementById("pr2__question").innerHTML;
        var UserInputAnswer = document.getElementById("pr2__answer").value
        var UserInputCapital = countryMap[UserInputCountry]
        var answerEntry = {
            "UserInputCountry": UserInputCountry,
            "UserInputAnswer": UserInputAnswer,
            "UserInputCapital": UserInputCapital
        }
        answers.splice(0, 0, answerEntry);
        var text = ''
        for (var i = 0; i < answers.length; i++) {
            if (answers[i]["UserInputAnswer"] == answers[i]["UserInputCapital"]) {
                text += '<tr style="color:blue"><td>' + answers[i]["UserInputCountry"] + ' </td><td>' + answers[i]["UserInputAnswer"] + '</td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
            } else {
                text += '<tr style="color:red"><td>' + answers[i]["UserInputCountry"] + ' </td><td><strike>' + answers[i]["UserInputAnswer"] + '</strike>' + '</td><td>' + answers[i]["UserInputCapital"] + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
            }
        }
        $("#myTable tbody").html(text)
        var randomCountry = Math.floor(Math.random() * (pairs.length))
        $('input[type="text"]').val('');
        document.getElementById("pr2__question").innerHTML = pairs[randomCountry]['country'];
        document.getElementById("pr2__answer").focus();

        // Code to upload the history to firebase

        database.ref('/').push({
        	correct: UserInputCountry == UserInputCapital,
        	correctAnswer: UserInputCapital,
        	country: UserInputCountry,
        	userAnswer: UserInputAnswer
        });
    };

    document.getElementById("pr2__submit").onclick = verifyAnswerAndUploadToFirebase;

    $('#pr2__answer').keypress(function(e) {
        // $("input[name='resultType'][value='all']").prop('checked', true);
        // var text = ''
        // for (var i = 0; i < answers.length; i++) {
        //     if (answers[i]["UserInputAnswer"] == answers[i]["UserInputCapital"]) {
        //         text += '<tr style="color:blue"><td>' + answers[i]["UserInputCountry"] + ' </td><td><span>' + answers[i]["UserInputAnswer"] + '</span></td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
        //     } else {
        //         text += '<tr style="color:red"><td>' + answers[i]["UserInputCountry"] + ' </td><td><strike>' + answers[i]["UserInputAnswer"] + '</strike>' + '</td><td>' + answers[i]["UserInputCapital"] + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
        //     }
        // }
        // $("#myTable tbody").html(text)
var key = e.which;
        if (key == 13) // the enter key code
        {
            verifyAnswerAndUploadToFirebase();
        }
    });

    $("input[name=resultType]").change(function() {
        var radioValue = $("input[name='resultType']:checked").val();
        if (radioValue == 'correct') {
            var text = ''
            for (var i = 0; i < answers.length; i++) {
                if (answers[i]["UserInputAnswer"] == answers[i]["UserInputCapital"]) {
                    text += '<tr style="color:blue"><td>' + answers[i]["UserInputCountry"] + ' </td><td><span>' + answers[i]["UserInputAnswer"] + '</span></td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
                }
            }
            $("#myTable tbody").html(text)
        } else if (radioValue == 'incorrect') {
            var text = ''
            for (var i = 0; i < answers.length; i++) {
                if (answers[i]["UserInputAnswer"] != answers[i]["UserInputCapital"]) {
                    text += '<tr style="color:red"><td>' + answers[i]["UserInputCountry"] + ' </td><td><strike>' + answers[i]["UserInputAnswer"] + '</strike>' + '</td><td>' + answers[i]["UserInputCapital"] + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
                }
            }
            $("#myTable tbody").html(text)
        } else if (radioValue == 'all') {
            var text = ''
            for (var i = 0; i < answers.length; i++) {
                if (answers[i]["UserInputAnswer"] == answers[i]["UserInputCapital"]) {
                    text += '<tr style="color:blue"><td>' + answers[i]["UserInputCountry"] + ' </td><td><span>' + answers[i]["UserInputAnswer"] + '</span></td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
                } else {
                    text += '<tr style="color:red"><td>' + answers[i]["UserInputCountry"] + ' </td><td><strike>' + answers[i]["UserInputAnswer"] + '</strike>' + '</td><td>' + answers[i]["UserInputCapital"] + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
                }
            }
            $("#myTable tbody").html(text)
        }
    });
    deleteEntry = function(i) {
        answers.splice(i, 1);
        var text = ''
        for (var i = 0; i < answers.length; i++) {
            if (answers[i]["UserInputAnswer"] == answers[i]["UserInputCapital"]) {
                text += '<tr style="color:blue"><td>' + answers[i]["UserInputCountry"] + ' </td><td><span>' + answers[i]["UserInputAnswer"] + '</span></td><td><i class="fa fa-check" aria-hidden="true"></i></td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
            } else {
                text += '<tr style="color:red"><td>' + answers[i]["UserInputCountry"] + ' </td><td><strike>' + answers[i]["UserInputAnswer"] + '</strike>' + '</td><td>' + answers[i]["UserInputCapital"] + '</td><td style="color:black"><button onclick="deleteEntry(' + i + ')">delete</button></td></tr>';
            }
        }
        $("#myTable tbody").html(text)
    }


const deleteFromFirebase = () => {
    
        var text = ''
        $("#myTable tbody").html(text)
       ;
			database.ref('/').remove();

        
    };

document.getElementById("pr3__clear").onclick = deleteFromFirebase;

    $('#pr3__clear').keypress(function(e) {
      
        deleteFromFirebase();
    });


});