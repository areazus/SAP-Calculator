
var attemptedCredits;
var earnedCredits;
var gpaCredits;
var earnedGPA;
var undergraduate;
var plannedSemesters;
var creditsTakesn;
var creditsForGpa;

function sapResults() {
	//Very large function, will be refactored in future versions
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
			result += "<button onclick=\"appealPlan()\" type=\"button\" id=\"apealPlan\">Please click here to make an appeal</button>"; 
		}
		
        document.getElementById("result").innerHTML = result;
    }
    return false;
}

function appealPlan(){
	var result = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
result += "<html xmlns=\"http://www.w3.org/1999/xhtml\">";
result += "<head>";
result += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
result += "<title>Untitled Document</title>";
result += "<style type=\"text/css\">";
result += "<!--";
result += "body {";
result += "	font: 100%/1.4 Verdana, Arial, Helvetica, sans-serif;";
result += "	background: #42413C;";
result += "	margin: 0;";
result += "	padding: 0;";
result += "	color: #000;";
result += "}";

result += "/* ~~ Element/tag selectors ~~ */";
result += "ul, ol, dl { /* Due to variations between browsers, it's best practices to zero padding and margin on lists. For consistency, you can either specify the amounts you want here, or on the list items (LI, DT, DD) they contain. Remember that what you do here will cascade to the .nav list unless you write a more specific selector. */";
result += "	padding: 0;";
result += "	margin: 0;";
result += "}";
result += "h1, h2, h3, h4, h5, h6, p {";
result += "	margin-top: 0;	 /* removing the top margin gets around an issue where margins can escape from their containing div. The remaining bottom margin will hold it away from any elements that follow. */";
result += "	padding-right: 15px;";
result += "	padding-left: 15px; /* adding the padding to the sides of the elements within the divs, instead of the divs themselves, gets rid of any box model math. A nested div with side padding can also be used as an alternate method. */";
result += "}";
result += "a img { /* this selector removes the default blue border displayed in some browsers around an image when it is surrounded by a link */";
result += "	border: none;";
result += "}";
result += "/* ~~ Styling for your site's links must remain in this order - including the group of selectors that create the hover effect. ~~ */";
result += "a:link {";
result += "	color: #42413C;";
result += "	text-decoration: underline; /* unless you style your links to look extremely unique, it's best to provide underlines for quick visual identification */";
result += "}";
result += "a:visited {";
result += "	color: #6E6C64;";
result += "	text-decoration: underline;";
result += "}";
result += "a:hover, a:active, a:focus { /* this group of selectors will give a keyboard navigator the same hover experience as the person using a mouse. */";
result += "	text-decoration: none;";
result += "}";

result += "/* ~~ this fixed width container surrounds all other elements ~~ */";
result += ".container {";
result += "	width: 960px;";
result += "	background: #FFF;";
result += "	margin: 0 auto; /* the auto value on the sides, coupled with the width, centers the layout */";
result += "}";

result += "/* ~~ This is the layout information. ~~ ";

result += "1) Padding is only placed on the top and/or bottom of the div. The elements within this div have padding on their sides. This saves you from any \"box model math\". Keep in mind, if you add any side padding or border to the div itself, it will be added to the width you define to create the *total* width. You may also choose to remove the padding on the element in the div and place a second div within it with no width and the padding necessary for your design.";

result += "*/";
result += ".content {";
result += "	padding: 10px 0;";
result += "	font-family: Verdana, Arial, Helvetica, sans-serif;";
result += "}";

result += "/* ~~ miscellaneous float/clear classes ~~ */";
result += ".fltrt {  /* this class can be used to float an element right in your page. The floated element must precede the element it should be next to on the page. */";
result += "	float: right;";
result += "	margin-left: 8px;";
result += "}";
result += ".fltlft { /* this class can be used to float an element left in your page. The floated element must precede the element it should be next to on the page. */";
result += "	float: left;";
result += "	margin-right: 8px;";
result += "}";
result += ".clearfloat { /* this class can be placed on a <br /> or empty div as the final element following the last floated div (within the #container) if the overflow:hidden on the .container is removed */";
result += "	clear:both;";
result += "	height:0;";
result += "	font-size: 1px;";
result += "	line-height: 0px;";
result += "}";
result += "-->";
result += "</style></head>";

result += "<body>";

result += "<div class=\"container\">";
result += "  <div class=\"content\">";
result += "    <p><img src=\"BrooklynCollege.jpg\" width=\"177\" height=\"69\" hspace=\"15\" /><br />";
result += "    <center><h3>TITLE IV SATISFACTORY ACADEMIC PROGRESS APPEAL</h3></center></p>";
result += "    <center><h4>STEPS TO FILE A TITLE IV APPEAL</h4></center>";
result += "	<blockquote>";
result += "	  1. This is a test<br />";
result += "      	 2. Step 2<br />";
result += "      	 3. Step 3<br />";
result += "         4. Step 4<br />";
result += "         5. Step 4";
result += "    </blockquote>";
result += "    <center><h4>DEADLINE</h4></center>";
result += "<p>Your  appeal must be received by <strong>DATE HERE</strong> for the <strong>TERM</strong> semester.</p>";
result += "<h4>Student Information:</h4>";
result += "<p>Last Name: <input name=\"LastName\" type=\"text\" id=\"LastName\" size=\"26\" maxlength=\"30\" />";
result += "  	&nbsp;&nbsp;First Name: <input name=\"FirstName\" type=\"text\" id=\"FirstName\" size=\"26\" maxlength=\"30\" />";
result += "  	&nbsp;&nbsp;EMPLID: <input name=\"EMPLID\" type=\"text\" id=\"EMPLID\" size=\"10\" maxlength=\"9\" /><br /><br />";
result += "  Street Address: ";
result += "  <input name=\"Address\" type=\"text\" id=\"Address\" value=\"\" size=\"97\" maxlength=\"120\" /><br /><br />";
result += "  City: ";
result += "  <input name=\"City\" type=\"text\" id=\"City\" value=\"\" size=\"30\" maxlength=\"50\" />";
result += "    &nbsp;&nbsp;State: ";
result += "  <input name=\"State\" type=\"text\" id=\"State\" value=\"\" size=\"30\" maxlength=\"30\" />";
result += "    &nbsp;&nbsp;ZIP Code: ";
result += "  <input name=\"Zip\" type=\"text\" id=\"Zip\" value=\"\" size=\"15\" maxlength=\"5\" /><br /><br />";
result += "  Email Address:  ";
result += "  <input name=\"Email\" type=\"email\" id=\"Email\" value=\"\" size=\"52\" maxlength=\"52\" />";
result += "  &nbsp;&nbsp;Phone Number:  ";
result += "  <input name=\"Phone\" type=\"number\" id=\"Phone\" value=\"\" size=\"12\" maxlength=\"12\" /><br /><br />";
result += "</p>";
result += "<h4>Step One (Reasoning):</h4>";
result += "<p><input type=\"checkbox\" name=\"reason4Appeal\" value=\"reason1\" />Reason1 <br />";
result += "<input type=\"checkbox\" name=\"reason4Appeal\" value=\"reason2\" />Reason2<br />";
result += "<input type=\"checkbox\" name=\"reason4Appeal\" value=\"reason3\" />Reason3<br />";
result += "<input type=\"checkbox\" name=\"reason4Appeal\" value=\"reason3\" />Reason4<br />";
result += "<input type=\"checkbox\" name=\"reason4Appeal\" value=\"reason3\" />Reason5<br /></p>";
result += "<h4>Step Two (Personal Satatement):</h4>";
result += "<p>";
result += "Provide a detailed explanation of the circumstances in Step One that led to the Satisfactory Academic Progress violation. Please provide a statement below. If additional space is needed, please attach a typed statement.<br />";
result += "<textarea name=\"personalStatement\" maxlength=\"1100\" cols=\"120\" rows=\"11\" id=\"State\"></textarea><br /><br />";
result += "</p>";
result += "<h4>Step Three (Progress):</h4>";
result += "<p>Please describe the steps you have taken to correct the problems that have prevented you from making Satisfactory Academic Progress. Please provide a statement below. If additional space is needed, please attach a typed statement.<br />";
result += "<textarea name=\"Steps\" maxlength=\"1100\" cols=\"120\" rows=\"11\" id=\"State\"></textarea>";
result += "</p>";
result += "<h4>Step Four:</h4>";
result += "<div id=\"result\">";
result += "	<span style=\"margin-left:3em\">Enter how many semesters you plan to take: <input type=\"number\" id=\"fsemester\" name=\"fsemester\" value=\"1\"></span>";
result += "    <button onclick=\"futurePlan()\" type=\"button\" id=\"futurePlan\">Plan</button>";
result += "    <button onclick=\"resetSapSemesters()\" type=\"button\" id=\"reset\" disabled=\"\">Reset</button>";
result += "  </div>";
result += "  <div id=\"semesters\"></div>";
result += "  <div id=\"finalizedPlan\"></div>";
result += "  <h4>Step Five:</h4>";
result += "  <h4>Step Six:</h4>";
result += "  <h4>Step Seven:</h4>";
result += "  ";
result += "  <!-- end .content -->";
result += "</div>";
result += "  <!-- end .container --></div>";
result += "</body>";
result += "</html>";

	
	
	document.open();
    document.write(result);
    document.close();
}


function resetSapSemesters() {
	//This function is called when student wants to remake his academic plan from scrach.
	//We basically empty all the contents of id 'semesters' and open up the fields. 
	document.getElementById("fsemester").disabled = false;
	document.getElementById("futurePlan").disabled = false;
	document.getElementById("reset").disabled = true;
	document.getElementById("semesters").innerHTML = "";
}

function resetSap(){
	//This basically reload the whole page, hence resetting the whole calculator
	location.reload();
}

function uPaceCreditsNeeded(acredits, ecredits) {
	//This function returns the number of credits required for the current pace of undergraduate student
    var tacredits = +acredits;
    var tecredits = +ecredits;
    var paceRequired = uCompletionRequired(tacredits);
    var currentPace = tecredits / tacredits;
    var tempCredits;
    while (currentPace < paceRequired) {
		if(paceRequired == 99.99){
			//A "bad" one
			//Pace required is 100%
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
	//Returns the number of credits that must be completed for number of attempted credits
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
	//This just validates the initial input to prevent miscalculations
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
	//This function returns the undergraduate required gpa for the credits attemptedW
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
	//For failed students, we ask them to make plan
	plannedSemesters = document.getElementById("fsemester").value
	if(+plannedSemesters > 0 && +plannedSemesters <4){
		var result = "";
		var i;
		document.getElementById("fsemester").disabled = true;
		document.getElementById("reset").disabled = false;
		document.getElementById("futurePlan").disabled = true;
		for(i = 0; i<+plannedSemesters; i++){
			result += "<div id=\"semester"+i+"\"></div>"
		}
		document.getElementById("semesters").innerHTML = result;
		addSemester(0); //Add semester 0
	}else{
		alert("Planned semesters must be between 1 and 3");
	}
}

function addSemester(ID){
	//Adds information about the semester 'ID' to the id semester
	var result = "<br><br><span style=\"margin-left:5em\">Enter how many classes you plan to take in Semester "+(+ID+1)+": <input type=\"number\" id=\"semesterClasses"+ID+"\" name=\"semesterClasses"+ID+"\" value=\"1\"></span>";
		result += "<button onclick=\"addSemesterClasses("+ID+")\" type=\"button\" id=\"addSemesterClasses"+ID+"\">Plan</button>"; 
		result += "<button onclick=\"resetSemester("+ID+")\" type=\"button\" id=\"resetSemester"+ID+"\" disabled=\"true\">Reset</button><br>"; 
		result += "<div id=\"semesterTable"+ID+"\"></div><br>"
		result += "<div id=\"semesterResults"+ID+"\"></div>"
	document.getElementById("semester"+ID).innerHTML = result;
}

function addSemesterClasses(ID){
	//Adds class table about the semester 'ID' to the id semesterTable
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
	var plannedClasses = document.getElementById("semesterClasses"+ID).value
	if(+plannedClasses>0){
		document.getElementById("semesterClasses"+ID).disabled = true;
		document.getElementById("addSemesterClasses"+ID).disabled = true;
		document.getElementById("resetSemester"+ID).disabled = false;
		var table = "<br><center><table style=\"width:50%\"><tr><th>Class Number</th><th>Credits</th><th>Planned Grade</th></tr>";
		var i;
		for(i=0; i<+plannedClasses; i++){
			table +=   "<tr><td>Class "+(i+1)+"</td><td><input type=\"number\" id=\"semester"+ID+"classes"+i+"\" name=\"semester"+ID+"classes"+i+"\" value=\"1\"></td><td><select id=\"semester"+ID+"classSelect"+i+"\">"+gradeSelectOptions+"</select></td></tr>";
		}
		table += "</table><button onclick=\"calculateSemester("+ID+")\" type=\"button\" id=\"calculateSemesterButton"+ID+"\">Calculate</button></center>";
		document.getElementById("semesterTable"+ID).innerHTML = table;
	}else{
		alert("Planned classes must be greater than 0");
	}
}

function calculateSemester(ID){
	//This calculates the results (gpa, pace, attempted credits) for the ID and all the previous semester
	//Currently it calculates again for ID and all previous semesters even though the previous ones were already calculated
	//Problem was what happens when student want to reset semesters in middle(ie 2 of 3), we would have to reset a lot of variables
	//In later version, this will be enhanced.
	var acredits = attemptedCredits;
    var ecredits = earnedCredits;
	var gpa = earnedGPA;
	var gcredits = gpaCredits;
	var gpaPoints = +gpa * +gcredits;
	var newCredits = 0;
	var newGpaPoints = 0;
	var plannedClasses = document.getElementById("semesterClasses"+ID).value;
	var i;
	var tmp;
	var newGPA;
	var result;
	
	document.getElementById("calculateSemesterButton"+ID).disabled = true;
	
	//Ensure that all credits for classes are above 0
	for(i = 0; i < +plannedClasses; i++){
		if(+document.getElementById(("semester"+ID+"classes"+i)).value < 1){
			alert("Credits for each class must be greater than 0");
			return;
		}
	}
	
	//Get credits and select values for current and previous semesters
	for(i = 0; i <= +ID; i++){
		plannedClasses = document.getElementById("semesterClasses"+i).value
		var j;
		for(j=0; j<+plannedClasses; j++){
			document.getElementById(("semester"+i+"classes"+j)).disabled = true;
			document.getElementById(("semester"+i+"classSelect"+j)).disabled = true;
			tmp = +document.getElementById(("semester"+i+"classes"+j)).value;
			newCredits += tmp;
			newGpaPoints += +document.getElementById(("semester"+i+"classSelect"+j)).value*tmp;
		}
	}
	
	//calculate new gpa
	newGPA = Math.round(((+gpaPoints + newGpaPoints)/(+gcredits+newCredits))*1000)/1000;
	
	//make the result
	result = "<br><span style=\"margin-left:3em\"><strong>Pace:</strong> Your new pace will be <strong>"+(Math.round((((+ecredits+newCredits)/(+acredits+newCredits)) * 100) * 100) / 100)+"%</strong></span><br>";
	result += "<span style=\"margin-left:3em\"><strong>GPA:</strong> Your new GPA will be <strong>"+newGPA+"</strong></span><br>";
	result += "<span style=\"margin-left:3em\"><strong>Max time frame:</strong> Your new attempted credits towards your max time frame will be <strong>"+(+acredits+newCredits)+"</strong> credits</span><br>";
		
	//if the calculation result for the current semester are last in line, we put finalize button;
	//otherwise, we add next semester data.
	if(+ID+1 == +plannedSemesters){
		result += "<br><button onclick=\"finalizePlan()\" type=\"button\" id=\"finalize\">Finalize this Plan</button><br>"; 
	}else{
		addSemester(+ID+1);
	}
	document.getElementById("semesterResults"+ID).innerHTML = result;
}

function resetSemester(ID){
	//When user wants to reset a semester;
	//we reset the current semester and any future semesters as well.
	document.getElementById("semesterClasses"+ID).disabled = false;
	document.getElementById("addSemesterClasses"+ID).disabled = false;
	document.getElementById("resetSemester"+ID).disabled = true;
	document.getElementById("semesterTable"+ID).innerHTML = "";
	document.getElementById("semesterResults"+ID).innerHTML = "";
	var i;
	for(i=+ID+1; i<plannedSemesters; i++){
		document.getElementById("semester"+i).innerHTML = "";
	}
}

function finalizePlan(){
	//We funalize plan and make it ready to print
	document.getElementById("reset").remove();
	document.getElementById("futurePlan").remove();
	document.getElementById("finalize").remove();
	var i;
	for(i=0; i<plannedSemesters; i++){
		document.getElementById(("resetSemester"+i)).remove();
		document.getElementById(("addSemesterClasses"+i)).remove();
		document.getElementById(("calculateSemesterButton"+i)).remove();
	}
}

function printPlan(){
	var i;
	var j;
	var creditsForEachSemester = [];
	var creditSelectedForEachSemester = [];
	var gradeSelectedForEachSemester = [];

	document.getElementById("print").remove();
	
	//Make a copy of the document that needs to be printed out
	var resultPage = "<html><style>table, th, td {border: 1px solid black; text-align: left;}</style><body>";
	resultPage += "<p>"+document.getElementById("sapCalc").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("result").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("semesters").innerHTML+"</p>";
	resultPage += "<p>"+document.getElementById("finalizedPlan").innerHTML+"</p>";
	resultPage +="</body></html>";
	
	//Copy each of the user input on the current page
	for(i=0; i<plannedSemesters; i++){
		creditsForEachSemester.push(document.getElementById(("semesterClasses"+i)).value)
	}
	for(i=0; i<creditsForEachSemester.length; i++){
		var creditsSelected = [];
		var gradesSelected = [];
		for(j=0; j<+creditsForEachSemester[i]; j++){
			creditsSelected.push(document.getElementById(("semester"+i+"classes"+j)).value);
			gradesSelected.push(document.getElementById(("semester"+i+"classSelect"+j)).value);
		}
		creditSelectedForEachSemester.push(creditsSelected);
		gradeSelectedForEachSemester.push(gradesSelected);
	}
	
	//Make a new document
	document.open();
    document.write(resultPage);
    document.close();
	
	//Paste over the user Entered values into the new document
	document.getElementById("acredits").value = attemptedCredits;
	document.getElementById("ecredits").value = earnedCredits;
	document.getElementById("gcredits").value = gpaCredits;
	document.getElementById("gpa").value = earnedGPA;
	document.getElementById("fsemester").value = plannedSemesters;
	if(undergraduate){
		document.getElementById("ugrd").checked = true;
	}else{
		document.getElementById("ugrd").checked = false;
		document.getElementById("grd").checked = true;
	}
	for(i=0; i<plannedSemesters; i++){
		document.getElementById("semesterClasses"+i).value = creditsForEachSemester[i];
		var creditsSelected = creditSelectedForEachSemester[i];
		var gradesSelected = gradeSelectedForEachSemester[i];
		for(j=0; j<+creditsForEachSemester[i]; j++){
			document.getElementById(("semester"+i+"classes"+j)).value = creditsSelected[j];
			document.getElementById(("semester"+i+"classSelect"+j)).value = gradesSelected[j];
		}
	}
	
	//Open up the print promt	
	window.print();
}

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