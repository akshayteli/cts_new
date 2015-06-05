<?php
session_start();
//mail Settings

include "../../inc/dbconn.php";
include "../../inc/function.php";
include "../common.php";


if (isset($_POST['action']) && ! empty($_POST['action'])) {
    $action = strtolower($_POST['action']);
} elseif (isset($_GET['action']) && ! empty($_GET['action'])) {
    $action = strtolower($_GET['action']);
}


switch ($action){
	
    case 'getstates':
		getStates();
		break;
    case 'getcities':
		getCities();
		break;
    case 'getdefaults':
		getDefaults();
		break;
    case 'getdssids':
		getDssIds();
		break;
    case 'getprocess':
		getProcess();
		break;

	case 'deletequestion':
		deleteQuestion();
		break;
	case 'deletesubheading':
		deleteSubHeading();
		break;
	case 'deleteheading':
		deleteHeading();
		break;

	case 'editquestion':
		editQuestion();
		break;
	case 'editquestion_categories':
		editQuestion_categories();
		break;
	case 'editsubheading':
		editSubHeading();
		break;
	case 'editheading':
		editHeading();
		break;
	case 'editheading_categories':
		editheading_categories();
		break;
	case 'deleteheading_category':
		deleteHeading_category();
		break;
	case 'deletequestion_category':
		deletequestion_category();
		break;
	case 'fetchquestions':
		fetchQuestions();
		break;
	case 'fetchauditdatapage':
		fetchAuditDataPage();
		break;
	case 'subcat':
		getAdminSubcategories();
		break;
	case 'getsubcategorydetails':
		getsubcategorydetails();
		break;
	case 'getrms':
		getRms();
		break;

}

function getsubcategorydetails() {
	$subID = $_GET["id"];
	// $auditID = $_GET["auditID"];

	$str ='{
		"details": [';

		$rows1 = selectrec("sc_header_id,sc_header_name,dss_sub_id","dss_sub_category_headers","active=1 and dss_sub_id=".$subID);

		foreach($rows1 as $row1){ 
			 $qIDs = selectrec("sc_question_id","dss_sub_category_question","active=1 and sc_header_id=".$row1[0]);
			   $question_IDs = "";
			   foreach($qIDs as $qID){ 
			    $question_IDs .= $qID[0].",";
			   }
			   $question_IDs = substr($question_IDs,0,-1);

		   		$weightage = singlefield("sum(sc_question_marks)","dss_sub_category_question","active=1 and sc_header_id=".$row1[0]);
			   // $total_score = singlefield("sum(dealer_score)","dss_answers_sub_category","active=1 and question_id in(".$question_IDs.")");

			$str .= '{
				"accordion_name": "'.$row1[1].'",
				"id": "'.$row1[0].'",
				"total_score": "'.$weightage.'",
				"questions": [ ';

				$rows2 = selectrec("sc_question_id,sc_question_name,sc_question_marks,sc_header_id","dss_sub_category_question","active=1 and sc_header_id=".$row1[0]);

				foreach($rows2 as $row2){ 
					
					$str .= '{
						"question": "'.$row2[1].'",
						"question_id": "'.$row2[0].'",
						"marks": "'.$row2[2].'"
						},';

			}

			$str = substr($str,0,-1);

			$str .= ']},';

			}

			$str = substr($str,0,-1);

			$str .= ']}';

			echo $str;
}


function getAdminSubcategories() {
	$dssId = $_GET["id"];
	$fields = "dss_sub_id,dss_sub_name,dss_id,icon";
	$table = "dss_sub_categories";
	$cond = "active=1 and dss_id=".$dssId;
	$rows = selectrec($fields,$table,$cond);
	$str ='{"details":[';

	foreach($rows as $row){ 
		$weightage = singlefield("sum(a.sc_question_marks)","dss_sub_category_question as a, dss_sub_category_headers as b","a.active=1 and a.sc_header_id=b.sc_header_id and b.dss_sub_id = ".$row[0]);
		

	//Task : Get all Subheader IDs, then get all questions from dss_sub_category_question with that subheader id

	//Get all Subheader IDs
	$sc_header_ids = selectrec("sc_header_id","dss_sub_category_headers","dss_sub_id=".$row[0]);
	$header_ids = "";
	foreach ($sc_header_ids as $sc_header_id) {
		$header_ids .= $sc_header_id[0].",";
	}
	$header_ids = rtrim($header_ids, ',');
	$qstr = "";

	//echo $header_ids;

	//get all Questions
	$qids = selectrec("sc_question_id","dss_sub_category_question","sc_header_id in(".$header_ids.")");
	$questionIDs = "";
	foreach ($qids as $qid) {
		$questionIDs .= $qid[0].",";
	}
	$questionIDs = rtrim($questionIDs, ',');
	$qstr = "";

	if($questionIDs!="")
		$qstr = "and question_id in(".$questionIDs.")";
	
	if($weightage==0)
		$weightMock = 1;
	else
		$weightMock = $weightage;	

	$str .='{
            "type_name": "'.$row[1].'",
            "type_id": "'.$row[0].'",
            "icon_name": "'.$row[3].'",
            "more_info": "audit_report_subheader.html?id='.$row[0].'",
            "legends": [
                {
                    "type": "Weightage",
                    "score": "'.$weightage.'"
                }
            ]
        },';

	}

	$str = substr($str,0,-1);


    $str = $str."]}";

    echo $str;
}


function getStates(){
	$rows = selectrec("state_id,state_name","dss_states","active=1");

	$str = '[';

	foreach ($rows as $row) {
		
		$str .='{"state_id":"'.$row[0].'","state_name": "'.$row[1].'"},';
	}

	$str = substr($str,0,-1);
	$str .=']';

	echo ($str);
}

function getCities(){
	$states = selectrec("state_id","dss_cities","active=1 group by state_id");
	
	$str = '[';

	foreach ($states as $state) {
		
		$str .='{"state_id":"'.$state[0].'","state_name": "'.singlefield("state_name","dss_states","state_id=".$state[0]).'","cities":[';

		$cities = selectrec("city_id,city_name","dss_cities","active=1 and state_id=".$state[0]);
		$str1 = "";

		foreach ($cities as $city) {
			
			$str1 .='{"city_id":"'.$city[0].'","city_name": "'.$city[1].'"},';

		}

		$str .= substr($str1,0,-1);


		$str .=']},';

	}

	$str = substr($str,0,-1);
	$str .=']';

	echo ($str);
}

function getDefaults(){
	$defaults = selectrec("default_id,default_type,default_desc","dss_defaults","active=1");
	
	$str = '[';

	foreach ($defaults as $default) {
		
		$str .='{"default_id":"'.$default[0].'","default_type": "'.$default[1].'","default_desc": "'.$default[2].'"},';
	}


	$str = substr($str,0,-1);
	$str .=']';

	echo ($str);
}

function getDssIds(){
	$defaults = selectrec("dss_id,dss_name,icon","dss_dssids","active=1");
	
	$str = '[';

	foreach ($defaults as $default) {
		
		$str .='{"dss_id":"'.$default[0].'","dss_name": "'.$default[1].'","icon": "'.$default[2].'"},';
	}


	$str = substr($str,0,-1);
	$str .=']';

	echo ($str);
}

function getProcess(){
	$dsss = selectrec("dss_id","dss_dssids","active=1 group by dss_id");
	
	$str = '[';

	foreach ($dsss as $dss) {
		
		$str .='{"dss_id":"'.$dss[0].'","dss_name": "'.singlefield("dss_name","dss_dssids","dss_id=".$dss[0]).'","process":[';

		$processes = selectrec("process_id,process_name","dss_process","active=1 and dss_id=".$dss[0]);
		$str1 = "";

		foreach ($processes as $process) {
			
			$str1 .='{"process_id":"'.$process[0].'","process_name": "'.$process[1].'"},';

		}

		$str .= substr($str1,0,-1);


		$str .=']},';

	}

	$str = substr($str,0,-1);
	$str .=']';

	echo ($str);
}

//******************Edit Functions ***********************************

function editQuestion(){
	$questionID = $_POST["txtQuestionID"];
	$questionName = htmlspecialchars($_POST["txtQuestionName"], ENT_QUOTES);
	$marks = $_POST["txtMarks"];

	$cond = "`sc_question_id`=".$questionID;
	$table = "dss_sub_category_question";

	$newval = "'".$questionName."',".$marks;
	$fieldname = "`question_name`,`max_score`";
	$col_val = "`sc_question_name`='".$questionName."', `sc_question_marks` = ".$marks;


	if(updaterecs($table,$col_val, $cond))
		$arr = array('status' => 1, 'message' => 'Update Success');
	else
		$arr = array('status' => 0, 'message' => 'Update Failure');

	echo json_encode($arr);
}


function editQuestion_categories(){
	$questionID = $_POST["txtQuestionID"];
	$questionName = htmlspecialchars($_POST["txtQuestionName"], ENT_QUOTES);
	$marks = $_POST["txtMarks"];

	$cond = "`question_id`=".$questionID;
	$table = "dss_questions";

	$newval = "'".$questionName."',".$marks;
	$fieldname = "`question_name`,`max_score`";
	$col_val = "`question_name`='".$questionName."', `max_score` = ".$marks;


	if(updaterecs($table,$col_val, $cond))
		$arr = array('status' => 1, 'message' => 'Update Success');
	else
		$arr = array('status' => 0, 'message' => 'Update Failure');

	echo json_encode($arr);
}

function editSubHeading(){
	$processID = $_POST["txtSubHeadingID"];

	$processName = htmlspecialchars($_POST["txtSubHeading"], ENT_QUOTES);

	$cond = "`process_id`=".$processID;
	$table = "dss_process";

	$newval = "'".$processName."'";
	$fieldname = "process_name";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Update Success');
	else
		$arr = array('status' => 0, 'message' => 'Update Failure');


	echo json_encode($arr);
}

function editheading_categories(){
	$processID = $_POST["txtHeadingID"];

	$processName = htmlspecialchars($_POST["txtHeading"], ENT_QUOTES);

	$cond = "`process_id`=".$processID;
	$table = "dss_process";

	$newval = "'".$processName."'";
	$fieldname = "process_name";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Update Success');
	else
		$arr = array('status' => 0, 'message' => 'Update Failure');

	echo json_encode($arr);
}

function editHeading(){
	$processID = $_POST["txtHeadingID"];

	$processName = htmlspecialchars($_POST["txtHeading"], ENT_QUOTES);

	$cond = "`sc_header_id`=".$processID;
	$table = "dss_sub_category_headers";

	$newval = "'".$processName."'";
	$fieldname = "sc_header_name";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Update Success');
	else
		$arr = array('status' => 0, 'message' => 'Update Failure');

	echo json_encode($arr);
}

//******************Delete Functions ***********************************

function deletequestion_category() {
	// $questionID = $_GET["txtQuestionID"];
	$questionID = $_POST["txtQuestionID"];

	$cond = "`question_id`=".$questionID;

	$newval = 0;

	$fieldname = "`active`";
	$table = "dss_questions";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Delete Success');
	else
		$arr = array('status' => 0, 'message' => 'Delete Failure');

	echo json_encode($arr);
}

function deleteQuestion(){
	// $questionID = $_GET["txtQuestionID"];
	$questionID = $_POST["txtQuestionID"];

	$cond = "`sc_question_id`=".$questionID;

	$newval = 0;

	$fieldname = "`active`";
	$table = "dss_sub_category_question";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Delete Success');
	else
		$arr = array('status' => 0, 'message' => 'Delete Failure');

	echo json_encode($arr);
}

function deleteSubHeading(){
	// $subHeadingID = $_GET["txtSubHeadingID"];
	$subHeadingID = $_POST["txtSubHeadingID"];

	$cond = "`sub_heading_id`=".$subHeadingID;

	$newval = 0;

	$fieldname = "`active`";
	$table = "dss_sub_heading";


	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Delete Success');
	else
		$arr = array('status' => 0, 'message' => 'Delete Failure');


	echo json_encode($arr);
}

function deleteHeading_category() {
	$headingID = $_POST["txtHeading"];

	$cond = "`process_id`=".$headingID;

	$newval = 0;

	$fieldname = "`active`";
	$table = "dss_process";

	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Delete Success');
	else
		$arr = array('status' => 0, 'message' => 'Delete Failure');

	echo json_encode($arr);
}

function deleteHeading(){
	// $headingID = $_GET["txtHeadingID"];
	$headingID = $_POST["txtHeading"];

	$cond = "`sc_header_id`=".$headingID;

	$newval = 0;

	$fieldname = "`active`";
	$table = "dss_sub_category_headers";


	if(updaterec($table,$fieldname,$newval,$cond))
		$arr = array('status' => 1, 'message' => 'Delete Success');
	else
		$arr = array('status' => 0, 'message' => 'Delete Failure');


	echo json_encode($arr);
}

function fetchQuestions(){

	$typeID = $_GET["typeID"];

	$fields = "question_id,question_name,sub_heading_id,max_score";
	$table = "dss_questions";
	$cond = "active=1 and process_id=".$typeID;
	//$rows = selectrec($fields,$table,$cond);

	

	$str = '{
			    "audit_type": "'.singlefield("dss_name","dss_dssids","dss_id=".$typeID).'",
			    "type_id": "'.$typeID.'",
			    "process": [';

    $rows = selectrec("process_id,process_name","dss_process","active=1 and dss_id=".$typeID);
    
    foreach ($rows as $row) {
    

	$questionIDS = "";
	$rows1 = selectrec("question_id","dss_questions","process_id =".$row[0]);
	foreach ($rows1 as $row1) {
		
		$questionIDS .= $row1[0].",";
	}

	$questionIDS = substr($questionIDS,0,-1);

	if($questionIDS!="")
		$tempStr = " and question_id in(".$questionIDS.")";
	else
		$tempStr = "";

	if($row[0]==2)
		$total = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$row[0]." and question_name NOT LIKE '%Customer 2:%'");
	else
		$total = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$row[0]);


	$str .= '{
		"type_name": "'.$row[1].'",
		"id": "'.$row[0].'",  
		"total": "'.$total.'",
		"headings":[ ';


		if($row[0]=="6"){
			$str .=getSubHeaders($row[0])."},";
		}
		else if($row[0]=="5" || $row[0]=="13"){
			$str .=getModelHeaders($row[0])."},";
		}
		else{
    		$str .= getQuestionsAnswers($row);
    		$str .=']},';
		}
		
    }

	$str = substr($str,0,-1);		      
	$str = $str."]}";

	echo $str;
}

function fetchAuditDataPage(){

	
		$arr = '{
		    '.default_headers("brand").',
		    "type": "Dealer Audit Dashboard",
		    "details": [';


		$fields = "dss_id,dss_name,icon";
		$table = "dss_dssids";
		$cond = "active=1";

		$arr .=fetchAuditData($fields,$table,$cond);		    

		$arr .=']}';
		echo $arr;
}

function getRms(){


	$name = "ZonalServiceManagers";

	$groupID = singlefield("id","auth_group","name='".$name."'");

	$userIDs = selectrec("user_id","auth_user_groups","group_id=".$groupID);




	$str = '{ "objects":[';
	$str1 = "";
	foreach ($userIDs as $userID) {


		$rec1 = singlerec("first_name, last_name, email","auth_user","id=".$userID[0]);
		$rec2 = singlerec("phone_number, address,asm_id","gm_userprofile","user_id=".$userID[0]);

		$str1 .='{

		            "id": "'.$userID[0].'",
		            "First name": "'.$rec1[0].'",
		            "Last name": "'.$rec1[1].'",
		            "email": "'.$rec1[2].'",
		            "mobile": "'.$rec2[0].'",
		            "address": "'.$rec2[1].'"
				},';
	}


	if($str1!="")
		$str .= substr($str1,0,-1);
	
	$str .=']}';

	echo ($str);

}

// ***************************************************************************************************************

function default_headers($default_type){
	$default_desc = singlefield("default_desc","dss_defaults","default_type='".$default_type."'");
	$str = '"'.$default_type.'": "'.$default_desc.'"';
	return $str;
}

function fetchAuditData($fields,$table,$cond){

		$rows = selectrec($fields,$table,$cond);
		$arr= "";
		$ribbonSum = calculateWeightage();
		$count = 0;

		foreach ($rows as $row) {
			
			$arr .= '{
			            "type_name": "'.$row[1].'",
			            "type_id": "'.$row[0].'",
			            "img_src": "img_url",
			            "weightage": "'.$ribbonSum[$count].'",
			            "icon_name": "'.$row[2].'",
			            "more_info": "admin-questionnaire.html?id='.$row[0].'"
			            
			        },';

			$count++;
		}

		$arr = substr($arr,0,-1);
		return $arr;
}

function getQuestionsAnswers($row,$auditID="",$sub_heading_id="",$modelID=""){

	$newCond = "";
	$subHeading = "";
	$groupBy = ""; 
	//echo "Karthik--->".$sub_heading_id."--><br/>";
	$str = "";
	if(!$sub_heading_id==""){
		$newCond = " sub_heading_id=".$sub_heading_id;
		$subHeading = singlefield("sub_heading_name","dss_sub_heading",$newCond);
		$groupBy = " group by sub_heading_id";
	}

	if(!$modelID==""){
		$newCond = " model_id=".$modelID;
		$subHeading = singlefield("model_name","vehicle_models",$newCond);
		$groupBy = " group by model_id";
	}

	if($newCond!="")
		$newCond1 = " and ".$newCond;
	else
		$newCond1 = "";

	//echo $newCond;

    $headings = selectrec("sub_heading_id","dss_questions","active=1 and process_id=".$row[0].$newCond1.$groupBy." limit 1");

    	$count = 0;

    	foreach ($headings as $heading) {
    		
			$str .= '{

					"sub_heading_id":"'.$heading[0].'",
					"sub_heading":"'.$subHeading.'",
					"questions": [ ';



	        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions","active=1".$newCond1." and process_id=".$row[0]);
	        $str1 = "";


	        foreach ($rows2 as $row2) {
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str1 .='{
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'",
	                    "marks": "'.$row2[3].'"';
	            

	            

	            $str1 .='},';
	        }
	        $str1 = substr($str1,0,-1);
			$str .= $str1.']},';

		}
	$str = substr($str,0,-1);
	

	return $str;
}

function getSubHeaders($pid){
	$fields = "sub_heading_id,sub_heading_name";
	$table = "dss_sub_heading";
	$cond = "active=1 and process_id=".$pid;
	$rows = selectrec($fields,$table,$cond);
	$str1 ='';
	foreach($rows as $row){ 
		$str1 .='{"sub_heading_id":"'.$row[0].'","sub_heading_name":"'.$row[1].'","questions":[';


	        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions","active=1 and sub_heading_id=".$row[0]." and process_id=".$pid);
	        $str2 = "";


	        foreach ($rows2 as $row2) {
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str2 .='{
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'",
	                    "marks": "'.$row2[3].'"';
	            
	            $str2 .='},';
	        }
	        $str2 = substr($str2,0,-1);


		$str1 .= $str2.']},';
	}

	$str1 = substr($str1,0,-1);


    $str1 = $str1."]";

    return $str1;
}

function getModelHeaders($pid){
	//echo "Karthik".$pid;

	$modelIDs = selectrec("model_id","dss_questions","active=1 and process_id=".$pid." group by model_id");

	$str1 ='';
	foreach($modelIDs as $modelID){
		//echo "YES ".$modelID[0]."<br/>";

		$fields = "model_id,model_name";
		$table = "vehicle_models";
		$cond = "active=1 and model_id=".$modelID[0];
		$rows = singlerec($fields,$table,$cond);
		
		$str1 .='{"sub_heading_id":"'.$rows[0].'","sub_heading_name":"'.$rows[1].'","questions":[';

	        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions","active=1 and process_id= ".$pid." and model_id=".$rows[0]);
	        $str2 = "";

	        foreach ($rows2 as $row2) {
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str2 .='{
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'",
	                    "marks": "'.$row2[3].'"';
	            
	            $str2 .='},';
	        }
	        $str2 = substr($str2,0,-1);



		$str1.=$str2.']},';


	}

	$str1 = substr($str1,0,-1);


	$str1 = $str1."]";

    return $str1;
}

function getSOPAdherence(){

	if(isset($_GET["subHeadingID"]))
		$sub_heading_id = $_GET["subHeadingID"];
	else
		$sub_heading_id = "";


	if(isset($_GET["modelID"]))
		$modelID = $_GET["modelID"];
	else
		$modelID = "";


	$audit_id = $_GET["audit_id"];
	$pid = $_GET["typeID"];
	$processID = $_GET["processID"];
	$row = array($processID);


	echo getQuestionsAnswers($row,$audit_id,$sub_heading_id,$modelID);
}



?>