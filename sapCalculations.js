
var attemptedCredits;
var earnedCredits;
var gpaCredits;
var earnedGPA;
var undergraduate;

function sapResults() {
    var acredits = document.getElementById("acredits").value;
    var ecredits = document.getElementById("ecredits").value;
    var gpa = document.getElementById("gpa").value;
	var gcredits = document.getElementById("gcredits").value;
    var result = "";
    var sapcount = 0;
    var maybe = 0;
	undergraduate = false;
    if (validate(gpa, acredits, ecredits, gcredits)) {
		document.getElementById("resetSap").disabled = false;
		document.getElementById("acredits").disabled = true;
		document.getElementById("ecredits").disabled = true;
		document.getElementById("gcredits").disabled = true;
		document.getElementById("gpa").disabled = true;
		document.getElementById("ugrd").disabled = true;
		document.getElementById("grd").disabled = true;
		document.getElementById("calculate").disabled = true;
		attemptedCredits = +acredits;
		earnedCredits = +ecredits;
		gpaCredits = +gcredits;
		earnedGPA = +gpa;
		var gpaPoints = +gpa * +gcredits;
        if (document.getElementById("ugrd").checked) {
            //Undergraduate Student
			undergraduate = true;
            { //Pace calculation
                result += "<strong>Pace:</strong><br>"
                var currentPace = +ecredits / +acredits;
                var pacePercentage = Math.round((currentPace * 100) * 100) / 100;
                var pace = "<span style=\"margin-left:3em\">Your pace is : " + pacePercentage + "%</span><br>";
                var requiredPace = uCompletionRequired(acredits);
                result += pace;
                if (currentPace < requiredPace) {
                    result += "<font color=\"red\"><span style=\"margin-left:3em\">Unfortunately, you do not meet the pace requirements to receive federal financial aid as an undergraduate student</font></span><br>";
                    result += "<span style=\"margin-left:3em\">With your attempted credits, your pace must be " + (requiredPace * 100) + "%</span><br>";
                    var paceCreditNeeded = uPaceCreditsNeeded(acredits, ecredits);
                    var totalNewACredits = +acredits + paceCreditNeeded;
                    var newPace = Math.round(uCompletionRequired(totalNewACredits) * 10000) / 100;
					if(paceCreditNeeded == -2){
						result += "<span style=\"margin-left:3em\">Unfortunately, any attempt to get back on pace will result in a failure in max attempted. Therefore, an advisor must construct your academic plan</span><br>";
					}else{
						result += "<span style=\"margin-left:3em\">To get back on pace, you need to attempt and complete about " + paceCreditNeeded + " credits, which will put you on/above pace of " + newPace + "% required for " + totalNewACredits + " attempted credits</span><br>";

					}
					sapcount++;
                } else {
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You meet the pace requirements as an undergraduate students</font></span><br>";
                }
                result += "<br>";
            }

            { //GPA 
                result += "<strong>GPA:</strong><br>"
                result += "<span style=\"margin-left:3em\">Your gpa is : " + gpa + "</span><br>"
                var gpaSap = 0;
                var gpaRequired = ugradRequiredGpa(acredits);
				if(+gpa < gpaRequired){
					gpaSap++;
				}
				
                if (gpaSap > 0) {
                    //Failed GPA SAP
                    result += "<span style=\"margin-left:3em\"><font color=\"red\">Unfortunately, you do not meet the cumulative (2.0 or above) GPA requirement as an undergraduate student</font></span><br>";
                    result += "<span style=\"margin-left:3em\">Your GPA must be equal to or greater than " + gpaRequired + " for the number of credits you attempted</span><br>";
					var creditsNeeded;
					var i;
					result += "<br><span style=\"margin-left:3em\">To raise your GPA to SAP standards:</span><br>";
					if(gcredits == 0){
						result += "<span style=\"margin-left:5em\">Any number of credits with C average</span><br>";
					}else{
						for(i=0; i<gradeArray.length; i++){
							lab:while(true){
								creditsNeeded = Math.round((gpaPoints - (gpaRequired*gcredits))/(gpaRequired-gradeArray[i].credits));
								if (gpaRequired<2.0 && creditsNeeded>1 && +gpaRequired != ugradRequiredGpa(+acredits + creditsNeeded)){
									console.log("Gpa Req: "+gpaRequired);
									gpaRequired = ugradRequiredGpa(+acredits + creditsNeeded);
								}else{
									break lab;
								}
							};
							if(creditsNeeded + +acredits <= 180){
								if(creditsNeeded > 0){
									result += "<span style=\"margin-left:5em\">You need "+creditsNeeded+" credits with grade of "+gradeArray[i].grade+" to bring your GPA to "+gpaRequired+", required for "+(+acredits+creditsNeeded)+" attempted credits.</span><br>";
								}
							}else if(i==0){
								result += "<span style=\"margin-left:5em\"><font color=\"red\">Unfortunately, you cannot raise your GPA to meet SAP standards without failing quantitatively (max attempted). Therefore, an advisor must construct your academic plan </font></span><br>";
								break;
							}else{
								break;
							}
						}
					}					
					sapcount++;
                } else {
                    //Didn't fail
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You meet the requirement for GPA as an undergraduate student</font></span><br>";
                }
                result += "<br>";
            }



            { //Max time calculation
                result += "<strong>Max Time Frame:</strong><br>";
                result += "<span style=\"margin-left:3em\">Your attempted credits are: " + acredits + "</span><br>";
                result += "<span style=\"margin-left:3em\">You can attempt up to 180 credits towards your undergraduate degree</span><br>";
                if (+acredits > 180) {
                    result += "<span style=\"margin-left:3em\"><font color=\"red\">Unfortunately, you do not meet the quantitative requirements (maximum time frame) as an undergraduate students</font></span><br>";
                    sapcount++;
                } else if (+acredits > 150) {
                    result += "<span style=\"margin-left:3em\"><font color=\"brown\">You currently meet the quantitative requirements (maximum time frame) as an undergraduate student. However, you are bordering failing, therefore any further unearned credits (F/W) will negatively impact your financial aid eligibility. </font></span><br>";
                } else {
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You meet the requirement for maximum time frame as an undergraduate students</font></span><br>";
                }
                result += "<br>";
            }
        } else {
            //Grad student
            { //Pace calculation
                result += "<strong>Pace:</strong><br>"
                var pacePercentage = Math.round(((+ecredits / +acredits) * 100) * 100) / 100;
                var pace = "<span style=\"margin-left:3em\">Your pace is : " + pacePercentage + "%</span><br>";
                result += pace;
                if (+pacePercentage < 67) {
                    result += "<font color=\"red\"><span style=\"margin-left:3em\">You don't meet the pace requirements for graduate students</font></span><br>";
                    var paceCreditNeeded = Math.round(((.67 * +acredits) - +ecredits) / .33);
                    result += "<span style=\"margin-left:3em\">To get back to pace of 67%, you need to attempt and complete about " + paceCreditNeeded + " credits</span><br>";
                    sapcount++;
                } else {
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You meet the pace requirements for graduate students</font></span><br>";
                }
                result += "<br>";
            }

            { //GRADUATE GPA 
                result += "<strong>GPA:</strong><br>"
                result += "<span style=\"margin-left:3em\">Your gpa is : " + gpa + "</span><br>"
                if (+gpa < 3.0) {
                    result += "<span style=\"margin-left:3em\"><font color=\"red\">Unfortunately, you do not meet the pace requirements to receive federal financial aid as a graduate student</font></span><br>";
                    result += "<span style=\"margin-left:3em\">You must bring your cumulative gpa to 3.0 or greater to meet this SAP requirement</span><br>";
                    
					var creditsNeeded;
					var i;
					result += "<br><span style=\"margin-left:3em\">To raise your GPA to SAP standards:</span><br>";
					if(gcredits == 0){
						result += "<span style=\"margin-left:5em\">Any number of credits with B average</span><br>";
					}else{
						for(i=0; i<gradeArray.length; i++){
							creditsNeeded = Math.round((gpaPoints - (3.0*gcredits))/(3.0-gradeArray[i].credits));
							if(creditsNeeded + +acredits <= 75){
								if(creditsNeeded > 0){
									result += "<span style=\"margin-left:5em\">You need "+creditsNeeded+" credits with grade of "+gradeArray[i].grade+" to bring your GPA to 3.0</span><br>";
								}
							}else if(i==0){
								result += "<span style=\"margin-left:5em\"><font color=\"red\">Unfortunately, you cannot raise your GPA to meet SAP standards without failing quantitatively (max attempted). Therefore, an advisor must construct your academic plan </font></span><br>";
								break;
							}else{
								break;
							}
						}					
					}
					sapcount++;
                } else {
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You meet the SAP GPA requirements as a graduate student</font></span><br>";
                }
                result += "<br>";
            }

            { //GRADUATE Max attempted 
                result += "<strong>Max Time Frame:</strong><br>";
                result += "<span style=\"margin-left:3em\">Your attempted credits are: " + acredits + "</span><br>";
                result += "<span style=\"margin-left:3em\">You can attempt up to 150% of credits required for your program</span><br>";
                if (+acredits > 45) {
                    result += "<span style=\"margin-left:3em\"><font color=\"brown\">Unfortunately, you may not meet the requirement for maximum time frame as a graduate students</font></span><br>";
                    result += "<span style=\"margin-left:3em\">Please contact the Office of Financial Aid for information on the number of maximum credits allowed for your degree</span>";
                    maybe++;
                } else {
                    result += "<span style=\"margin-left:3em\"><font color=\"green\">You may meet this requirement as a graduate student</font></span><br>";
                }
                result += "<br>";
            }
        }
        result += "<br><center>From the information provided, you ";
        if (sapcount > 0) {
            result += "<font color=\"red\">may not be</font>";
        } else if (maybe == 1) {
            result += "<font color=\"brown\">may or may not be</font>";
        } else {
            result += "<font color=\"green\">may be</font>";
        }
        result += " eligible for financial aid.<br>Please be advised that these are unofficial results and the final determination of eligibility will be made ONLY by the Office of Financial Aid and the SAP committee. The sole submission of an academic plan does not deem you eligible for federal financial aid.";
        result += "</center><br>";
		
		//future planning
		if(sapcount > 0){
			result += "<strong>Please use the tool below to plan and submit with your SAP appeal</strong><br><br>";
			result += "<span style=\"margin-left:3em\">Enter how many classes you plan to take: <input type=\"number\" id=\"fclasses\" name=\"fclasses\" value=\"1\"></span>";
			result += "<button onclick=\"futurePlan()\" type=\"button\" id=\"futurePlan\">Plan</button>"; 
			result += "<button onclick=\"resetTable()\" type=\"button\" id=\"reset\" disabled=\"true\">Reset</button>"; 
		}
		
        document.getElementById("result").innerHTML = result;
    }
    return false;
}


function resetTable(){
	document.getElementById("futurePlan").disabled = false;
	document.getElementById("reset").disabled = true;
	document.getElementById("fclasses").disabled = false;
	document.getElementById("classes").innerHTML = "";
	document.getElementById("classesResults").innerHTML = "";
}

function resetSap(){
	document.getElementById("resetSap").disabled = true;
	document.getElementById("acredits").disabled = false;
	document.getElementById("ecredits").disabled = false;
	document.getElementById("gcredits").disabled = false;
	document.getElementById("gpa").disabled = false;
	document.getElementById("ugrd").disabled = false;
	document.getElementById("grd").disabled = false;
	document.getElementById("calculate").disabled = false;
	document.getElementById("result").innerHTML = "";
	document.getElementById("finalizedPlan").innerHTML = "";
	document.getElementById("classes").innerHTML = "";
	document.getElementById("classesResults").innerHTML = "";
}

function uPaceCreditsNeeded(acredits, ecredits) {
    var tacredits = +acredits;
    var tecredits = +ecredits;
    var paceRequired = uCompletionRequired(tacredits);
    var currentPace = tecredits / tacredits;
    var tempCredits;
    while (currentPace < paceRequired) {
		if(paceRequired == 99.99){
			//A "bad" one
			return -2;
		}
        tempCredits = Math.round(((paceRequired * +tacredits) - +tecredits) / (1 - paceRequired));
        tempCredits = tempCredits == 0 ? 1 : tempCredits;
        tacredits += tempCredits;
        tecredits += tempCredits;
        currentPace = tecredits / tacredits;
        paceRequired = uCompletionRequired(tacredits);
    };
    return tecredits - +ecredits;
}

function uCompletionRequired(acredits) {
    if (+acredits < 25) {
        return 0;
    } else if (+acredits <= 30) {
        return .15;
    } else if (+acredits <= 36) {
        return .25;
    } else if (+acredits <= 45) {
        return .35;
    } else if (+acredits <= 48) {
        return .40;
    } else if (+acredits <= 60) {
        return .45;
    } else if (+acredits <= 72) {
        return .50;
    } else if (+acredits <= 94) {
        return .55;
    } else if (+acredits <= 120) {
        return .60;
    } else if (+acredits <= 129) {
        return .61;
    } else if (+acredits <= 138) {
        return .62;
    } else if (+acredits <= 150) {
        return .63;
    } else if (+acredits <= 151) {
        return .64;
    } else if (+acredits <= 156) {
        return .65;
    } else if (+acredits <= 164) {
        return .65;
    } else if (+acredits <= 180) {
        return .65;
    } else {
        return 99.99;
    }
}

function validate(gpa, acredits, ecredits, gcredits) {
    if (+gpa > 4.0 || +gpa < 0.0) {
        alert("GPA must be between 0.00 and 4.00");
        return false;
    } else if (+acredits <= 0 || +ecredits < 0) {
        alert("Attempted credits and Earned Credits must be greater or equal to 0");
        return false;
    } else if (+acredits < +ecredits) {
        alert("Attempted credits must be greater or equal to Earned credits");
        return false;
    } else if(+gcredits == 0 && +gpa > 0){
		alert("GPA credits must be greater than 0 for GPA above 0.00");
        return false;
	} else if(+gcredits > acredits){
		alert("GPA credits must be less than or equal to Attempted credits");
        return false;
	}
    return true;
}

function ugradRequiredGpa(acredits){
	if(+acredits <= 12){
		return 1.5;
	}else if (+acredits <= 24) {
		return 1.75;
	}else{
		return 2.0;
	}
}

function Grade(grade, credits) {
  this.grade = grade;
  this.credits = credits;
}

function futurePlan(){
	var gradeSelectOptions= "<option value=\"4.0\">A/A+</option>"
					+"<option value=\"3.7\">A-</option>"
					+"<option value=\"3.3\">B+</option>"
					+"<option value=\"3.0\">B</option>"
					+"<option value=\"2.7\">B-</option>"
					+"<option value=\"2.3\">C+</option>"
					+"<option value=\"2.0\">C</option>"
					+"<option value=\"1.7\">C-</option>"
					+"<option value=\"1.3\">D+</option>"
					+"<option value=\"1.0\">D</option>";
	plannedClasses = document.getElementById("fclasses").value
	if(+plannedClasses>0){
		document.getElementById("futurePlan").disabled = true;
		document.getElementById("reset").disabled = false;
		document.getElementById("fclasses").disabled = true;
		var table = "<br><center><table style=\"width:50%\"><tr><th>Class Number</th><th>Credits</th><th>Planned Grade</th></tr>";
		var i;
		for(i=0; i<+plannedClasses; i++){
			table +=   "<tr><td>Class "+(i+1)+"</td><td><input type=\"number\" id=\"classes"+i+"\" name=\"classes"+i+"\" value=\"1\"></td><td><select id=\"classSelect"+i+"\">"+gradeSelectOptions+"</select></td></tr>";
		}
		table += "</table><button onclick=\"calculateFuturePlan()\" type=\"button\" id=\"fterm\">Calculate</button></center>";
		document.getElementById("classes").innerHTML = table;
	}else{
		alert("Planned classes must be greater than 0");
	}
}

function calculateFuturePlan(){
	var acredits = document.getElementById("acredits").value;
    var ecredits = document.getElementById("ecredits").value;
	var gpa = document.getElementById("gpa").value;
	var gcredits = document.getElementById("gcredits").value;
	var gpaPoints = +gpa * +gcredits;
	var newCredits = 0;
	var newGpaPoints = 0;
	var i;
	var tmp;
	for(i=0; i<plannedClasses; i++){
		tmp = +document.getElementById(("classes"+i)).value;
		if(tmp<1){
			alert("Credits for each class must be greater than 0");
			return;
		}
		newCredits += tmp;
		newGpaPoints += +document.getElementById(("classSelect"+i)).value*tmp;
	}
	var newGPA = Math.round(((+gpaPoints + newGpaPoints)/(+gcredits+newCredits))*1000)/1000;
	var result = "<br><strong>Pace:</strong> Your new pace will be <strong>"+(Math.round((((+ecredits+newCredits)/(+acredits+newCredits)) * 100) * 100) / 100)+"%</strong><br>";
	result += "<strong>GPA:</strong> Your new GPA will be <strong>"+newGPA+"</strong><br>";
	result += "<strong>Max time frame:</strong> Your new attempted credits towards your max time frame will be <strong>"+(+acredits+newCredits)+"</strong> credits<br>";
	result += "<br><button onclick=\"finalizePlan()\" type=\"button\" id=\"finalize\">Finalize this Plan</button><br>"
	document.getElementById("classesResults").innerHTML = result;
	
}

function finalizePlan(){
	document.getElementById("calculate").remove();
	document.getElementById("resetSap").remove();
	document.getElementById("futurePlan").remove();
	document.getElementById("reset").remove();
	document.getElementById("fterm").remove();
	document.getElementById("finalize").remove();
	var i;
	for(i=0; i<plannedClasses; i++){
		document.getElementById(("classSelect"+i)).disabled = true;
		document.getElementById(("classes"+i)).disabled = true;
	}
	var date = new Date().toLocaleString();
	var finalResults ="Your Name:____________________________________________<br><br>";
	finalResults += "Your Signatures:____________________________________________<br><br>";
	finalResults += "Todays Date:"+date+"<br><br><br>";
	finalResults += "Academic Advisor Name:____________________________________________<br><br>";
	finalResults += "Academic Advisor Signatures:____________________________________________<br><br>"
	finalResults += "Advisement Date:____________________________________________<br><br>"
	finalResults += "<center><button onclick=\"printPlan()\" type=\"button\" id=\"print\">Print this Plan</button></center><br>"
	document.getElementById("finalizedPlan").innerHTML = finalResults;

}

function printPlan(){
	document.getElementById("print").remove();
	var resultPage = "<html><style>table, th, td {border: 1px solid black; text-align: left;}</style><body>";
	resultPage += "<p>"+document.getElementById("sapCalc").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("result").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("classes").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("classesResults").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("finalizedPlan").innerHTML+"</p>";
	resultPage +="</body></html>";
	
	var creditsSelected = [];
	var gradesSelected = [];
	var i;
	for(i=0; i<plannedClasses; i++){
		creditsSelected.push(document.getElementById(("classes"+i)).value);
		gradesSelected.push(document.getElementById(("classSelect"+i)).value);
	}
	
	document.open();
    document.write(resultPage);
    document.close();
	
	document.getElementById("acredits").value = attemptedCredits;
	document.getElementById("ecredits").value = earnedCredits;
	document.getElementById("gcredits").value = gpaCredits;
	document.getElementById("gpa").value = earnedGPA;
	if(undergraduate){
		document.getElementById("ugrd").checked = true;
	}else{
		document.getElementById("ugrd").checked = false;
		document.getElementById("grd").checked = true;
	}
	document.getElementById("fclasses").value = plannedClasses;
	for(i=0; i<plannedClasses; i++){
		document.getElementById(("classes"+i)).value = creditsSelected[i];
		document.getElementById(("classSelect"+i)).value = gradesSelected[i];
	}
	
		
	window.print();
}

var plannedSemesters;
var plannedClasses;
var creditsTakesn;
var creditsForGpa;

var gradeArray = new Array(
	new Grade("A/A+", 4.0),
	new Grade("A-", 3.7),
	new Grade("B+", 3.3),
	new Grade("B", 3.0),
	new Grade("B-", 2.7),
	new Grade("C+", 2.3),
	new Grade("C", 2.0),
	new Grade("C-", 1.7),
	new Grade("D+", 1.3),
	new Grade("D", 1.0)
);