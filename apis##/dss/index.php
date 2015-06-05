<?php
session_start();
//mail Settings

//echo $_GET['action'];
include "../inc/dbconn.php";
include "../inc/function.php";
include "common.php";

$timezone = "Asia/Calcutta";
if(function_exists('date_default_timezone_set')) date_default_timezone_set($timezone); 


if (isset($_POST['action']) && ! empty($_POST['action'])) {
    $action = strtolower($_POST['action']);
} elseif (isset($_GET['action']) && ! empty($_GET['action'])) {
    $action = strtolower($_GET['action']);
}


switch ($action){
    case 'logincheck':
		loginCheck();
		break;
    case 'logincheckext':
		loginCheckExt();
		break;
    case 'getdashboarddata':
		getDashBoardData();
		break;
    case 'moreinfoaudits':
		moreInfoAudits();
		break;
    case 'getdealers':
		getDealers();
		break;
    case 'startnewaudit':
		startNewAudit();
		break;
    case 'fetchauditdatapage':
		fetchAuditDataPage();
		break;
    case 'fetchquestions':
		fetchQuestions();
		break;
    case 'customerslist':
		customersList();
		break;
    case 'answerslist':
		answersList();
		break;
	case 'answerslist_subheaders':
		answersList_subHeaders();
	    break;
    case 'answerslist1':
		answersList1();
		break;
    case 'submitquestionnaire':
		submitQuestionnaire();
		break;
    case 'mainmenu':
		mainMenu();
		break;
    case 'sidemenu':
		sideMenu();
		break;
    case 'getsopadherence':
		getSOPAdherence();
		break;
	case 'getrepairsopdata':
		getRepairSopData();
		break;
    case 'getjobrole':
		getJobRole();
		break;
    case 'fq':
		fq();
		break;
    case 'getsubcategories':
		getSubCategories();
		break;
    case 'getsubcategorydetails':
		getSubCategoryDetails();
		break;
    case 'savemanpower':
		saveManpower();
		break;
    case 'getmanpower':
		getManpower();
		break;
    case 'getreportapi':
		getreportAPI();
		break;
    case 'getrsms':
		getRsms();
		break;
    case 'getasms':
		getAsms();
		break;
    case 'getzones':
		getZones();
		break;
    case 'fetchauditdatapageemail':
		fetchAuditDataPageEmail();
		break;
    case 'showzerosemail':
		showZerosEmail();
		break;
    case 'deleteaudit':
		deleteAudit();
		break;

}

function loginCheck(){

	$access_token="";
	$userID="";

	$access_token=$_POST['access_token']; 
	$userID=intval($_POST['userID']);

	
	$access = singlefield("id","oauth2_accesstoken","user_id=".$userID." and token='".$access_token."'");
	$access = 1;
	if($access){

		$groupID = singlefield("group_id", "auth_user_groups", "user_id = ".$userID);

		$role_name = singlefield("name", "auth_group", "id = ".$groupID);
		$img_URL = "";


			$name = singlefield("first_name", "auth_user", "id=".$userID). " ".singlefield("last_name", "auth_user", "id=".$userID);

			$_SESSION['NAME'] = $name;
			$_SESSION['USERNAME'] = singlefield("username","auth_user","id=".$userID);
			$_SESSION['USER_ID'] = $userID;
			$_SESSION['ROLE_NAME'] 	= $role_name;

			if($role_name == "Admins" || $role_name == "SuperAdmins" || $role_name == "LoyaltySuperAdmins")
				$_SESSION['ROLE'] = 5;
			else if($role_name == "ZonalServiceManagers")
				$_SESSION['ROLE'] = 1;
			else if($role_name == "AreaServiceManagers")
				$_SESSION['ROLE'] = 2;
			else if($role_name == "Dealers")
				$_SESSION['ROLE'] = 3;
			else
				$_SESSION['ROLE'] = 0;

			// echo $role_name."Kadfdf";
			$area = singlefield("area","gm_areaservicemanager","user_id=".$userID);
			$rec_id = singlefield("id","gm_areaservicemanager","user_id=".$userID);

			if($area==""){
				//For RSM
				$area = singlefield("regional_office","gm_zonalservicemanager","user_id=".$userID);
				$rec_id = singlefield("id","gm_zonalservicemanager","user_id=".$userID);
			}

			$_SESSION['IMAGE_URL'] = $img_URL;

			$arr = array('status' => 1,'user_type' => $role_name, 'message' => 'Login Success. Redirecting...', 'name' => $name, 'username' => singlefield("username", "auth_user", "id=".$userID), 'img_url'=> singlefield("url","users","user_id=".$userID), 'role'=> $_SESSION['ROLE'], 'userid' => $userID, 'area' => $area, 'rec_id' => $rec_id);
	}
	else{
		$arr = array('status' => 0, 'message' => 'Login Failure. Please try again');
		
	}

	echo json_encode($arr);
}

//Login the user if he is from a external URL
function loginCheckExt(){

	$access_token="";
	$userID="";

	$access_token=$_POST['access_token']; 
	$userID=intval($_POST['userID']);

	$userID = singlefield("id","auth_user","username='".$userID."'");

	$access = singlefield("id","oauth2_accesstoken","user_id=".$userID." and token='".$access_token."'");
	
	if($access){

		$groupID = singlefield("group_id", "auth_user_groups", "user_id = ".$userID);

		$role_name = singlefield("name", "auth_group", "id = ".$groupID);
		$img_URL = "";

			$name = singlefield("first_name", "auth_user", "id=".$userID). " ".singlefield("last_name", "auth_user", "id=".$userID);

			$_SESSION['NAME'] = $name;
			$_SESSION['USERNAME'] = singlefield("username","auth_user","id=".$userID);
			$_SESSION['USER_ID'] = $userID;
			$_SESSION['ROLE_NAME'] 	= $role_name;

			if($role_name == "Admins" || $role_name == "SuperAdmins" || $role_name == "LoyaltySuperAdmins")
				$_SESSION['ROLE'] = 5;
			else if($role_name == "ZonalServiceManagers")
				$_SESSION['ROLE'] = 1;
			else if($role_name == "AreaServiceManagers")
				$_SESSION['ROLE'] = 2;
			else if($role_name == "Dealers")
				$_SESSION['ROLE'] = 3;
			else
				$_SESSION['ROLE'] = 0;

			// echo $role_name."Kadfdf";
			$area = singlefield("area","gm_areaservicemanager","user_id=".$userID);
			$rec_id = singlefield("id","gm_areaservicemanager","user_id=".$userID);

			if($area==""){
				//For RSM
				$area = singlefield("regional_office","gm_zonalservicemanager","user_id=".$userID);
				$rec_id = singlefield("id","gm_zonalservicemanager","user_id=".$userID);
			}

			$_SESSION['IMAGE_URL'] = $img_URL;

			$arr = array('status' => 1,'user_type' => $role_name, 'message' => 'Login Success. Redirecting...', 'name' => $name, 'username' => singlefield("username", "auth_user", "id=".$userID), 'img_url'=> singlefield("url","users","user_id=".$userID), 'role'=> $_SESSION['ROLE'], 'userid' => $userID, 'area' => $area, 'rec_id' => $rec_id);
	}
	else{
		$arr = array('status' => 0, 'message' => 'Login Failure. Please try again');
		
	}

	echo json_encode($arr);
}

function getDashBoardData(){
	 // $_SESSION['ROLE']=2;
	  //$_SESSION['USER_ID']=67;
	  // echo $_SESSION['ROLE']."Akshay";
	 $currentDate = date('M j Y', time());
	 $str = '{'.default_headers("brand").','.default_headers("type").',"service_name":"Dashboard",'.default_headers("service_name").',"current_date" : "'.$currentDate.'",';

	 $fields = "count(audit_id)";
	 $table = "dss_audits";
	 $cond1 = "active=1 and status=1";
	 $cond2 = "active=1 and status=2";
	 $count=0;

	 if($_SESSION['ROLE']==1){
		//For Admin

	 	$zsm_id = singlefield("id","gm_zonalservicemanager","user_id=".$_SESSION['USER_ID']);

		$auditorIDs = commaSeperated("user_id","gm_areaservicemanager","zsm_id=".$zsm_id);
		// echo $auditorIDs;

		$rows1 = singlerec($fields,$table,$cond1." and auditor_id in (".$auditorIDs.")");
		$rows2 = singlerec($fields,$table,$cond2);

	 }
	 if($_SESSION['ROLE']== 5){
		//For Super Admin
		$rows1 = singlerec($fields,$table,$cond1);
		$rows2 = singlerec($fields,$table,$cond2);

	 }
	 else if($_SESSION['ROLE']==2){
		//For Auditor
		$rows1 = singlerec($fields,$table,$cond1." and auditor_id=".$_SESSION['USER_ID']);
		$rows2 = singlerec($fields,$table,$cond2." and auditor_id=".$_SESSION['USER_ID']);

	 }
	 else if($_SESSION['ROLE']==3){
		//For Dealer
		$rows1 = singlerec($fields,$table,$cond1." and dealer_id=".$_SESSION['USER_ID']);
		$rows2 = singlerec($fields,$table,$cond2." and dealer_id=".$_SESSION['USER_ID']);

	 }


	 $str .= '"objects" : [
	        ';
	 if($_SESSION['ROLE'] != 2){
	     $str .='{
	              "id" : "1",
	              "value": "'.$rows1[0].'",
	              "name": "Submitted Audits",
	              "bg_name": "bringle",
	              "bg_color": "#34495e",
	        "icon_name": "fa-check",
	              "img_src": "",
	              "more_info": "moreinfo-audits.html"
	       }';
	 }
	 switch ($_SESSION['ROLE']){
	  // Super Admin
	  case 5: $str .=',{
	              "id" : "2",
	              "value": "+",
	              "name": "Edit Questionnaire",
	              "bg_name": "bringle",
	              "bg_color": "#34495e",
	           "icon_name": "fa-edit",
	              "img_src": "img/search_engine_optimisation-512.png",
	              "more_info": "admin-categories.html"
	       },{
	      
	              "id" : "3",
	              "value": "+",
	              "name": "Show Reports",
	              "bg_name": "bringle",
	              "bg_color": "#34495e",
	     "icon_name": "fa-tasks",
	              "img_src": "img/search_engine_optimisation-512.png",
	              "more_info": "admin-reports.html"
	       },{
	        
	              "id" : "4",
	              "value": "+",
	              "name": "Users",
	              "bg_name": "bringle",
	              "bg_color": "#34495e",
	     "icon_name": "fa-users",
	              "img_src": "img/search_engine_optimisation-512.png",
	              "more_info": "users.html"
	       }';
	       break;
	  // RSMs
	  case 1: $str .= ',{
	      
	                "id" : "2",
	                "value": "+",
	                "name": "Show Reports",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	       "icon_name": "fa-tasks",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "admin-reports.html"
	         },{
	          
	                "id" : "3",
	                "value": "+",
	                "name": "Users",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	       "icon_name": "fa-users",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "users.html"
	         },{
	          
	                "id" : "4",
	                "value": "+",
	                "name": "All Dealers",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	       "icon_name": "fa-users",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "dealers.html"
	         }';
	         break;
	  // ASMs         
	  case 2: $str .= '{ 
	                "id" : "3",
	                "value": "+",
	                "name": "Start New Audit",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	             "icon_name": "fa-edit",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "audit-report_new.html"
	         },{
	                "id" : "2",
	                "value": "'.$rows2[0].'",
	                "name": "Saved Audits",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	             "icon_name": "fa-clipboard",
	                "img_src": "",
	                "more_info": "moreinfo-audits.html"
	            },{
	                "id" : "1",
	                "value": "'.$rows1[0].'",
	                "name": "Submitted Audits",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	             "icon_name": "fa-check",
	                "img_src": "",
	                "more_info": "moreinfo-audits.html"
	         },{
	      
	                "id" : "4",
	                "value": "+",
	                "name": "Show Reports",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	       "icon_name": "fa-tasks",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "admin-reports.html"
	         },{
	          
	                "id" : "5",
	                "value": "+",
	                "name": "Users",
	                "bg_name": "bringle",
	                "bg_color": "#34495e",
	       "icon_name": "fa-users",
	                "img_src": "img/search_engine_optimisation-512.png",
	                "more_info": "users.html"
	         }';
	         break;
	  // case 3: $str = '';
	 }
	 
	 $str.='
	        ]
	    }';



	 echo $str;
}

function moreInfoAudits(){

	$str = '{'.default_headers("brand").','.default_headers("type").',"service_name":"Saved Audits","bg_color" : "#1C92C5","font_color" : "#FFF","columns" : [{"header_name" : "Dealer Code"},{"header_name" : "Dealer Name"},{"header_name" : "Audited Date"},{"header_name" : "Total Score"}],"details": [';

	$status_id = $_GET['statusID'];


	$fields = "audit_id,auditor_id,dealer_id,datetime,stat_timestamp";
	$table = "dss_audits";


	if($_SESSION['ROLE']==1){
		//For Admin
	 	$zsm_id = singlefield("id","gm_zonalservicemanager","user_id=".$_SESSION['USER_ID']);
	 	
		$auditorIDs = commaSeperated("user_id","gm_areaservicemanager","zsm_id=".$zsm_id);

		$cond = "active=1 and status=".$status_id." and auditor_id in (".$auditorIDs.")";
		
	}
	else if($_SESSION['ROLE']==5){
		//For Super Admin

		$cond = "active=1 and status=".$status_id;

	}
	else if($_SESSION['ROLE']==2){
		//For Auditor

		$cond = "active=1 and auditor_id=".$_SESSION['USER_ID']." and status=".$status_id;

	}
	else if($_SESSION['ROLE']==3){
		//For Dealer

		$cond = "active=1 and dealer_id=".$_SESSION['USER_ID']." and status=".$status_id;

	}




	$rows = selectrec($fields,$table,$cond);
	$str1 = "";
	
	foreach($rows as $row){ 

		$finalTotal = 0;
		
		$audit_id = $row[0];
		$fields = "dss_id,dss_name,icon";
		$table = "dss_dssids";
		$cond = "active=1";


		$processBlocks = selectrec($fields,$table,$cond);
		$dealer_score = 0;

		foreach ($processBlocks as $processBlock){
		
			$totalData = calculateTotal($audit_id,$processBlock[0]);

			// $totalValues = array("totalScore" => $total_score, "dealerScore"=>$dealer_score, "adherence" => $adherence, "subStat" => $subStat, "max_score" => $max_score, "subCategory" => $subCategory);

			$dealer_score1 	= $totalData["dealerScore"];
			$adherence 		= $totalData["adherence"];
			$subStat 		= $totalData["subStat"];
			$max_score 		= $totalData["max_score"];
			$subCategory 	= $totalData["subCategory"];

			$dealer_score 	+= $dealer_score1;

		}

		
		$dealer_name = singlefield("first_name", "auth_user", "id=".$row[2]). " ".singlefield("last_name", "auth_user", "id=".$row[2]);
		$audited_by = singlefield("first_name", "auth_user", "id=".$row[1]). " ".singlefield("last_name", "auth_user", "id=".$row[2]);
		$dealer_code = singlefield("dealer_id","gm_dealer","user_id=".$row[2]);

		$edate = $row[4];

		if($edate == "0000-00-00 00:00:00")
			$edate = "-";

		$str1 .='{
            "dealer_id": '.$row[2].',
            "dealer_code": "'.$dealer_code.'",
            "audit_id" : "'.$row[0].'" ,
            "audited_by" : "'.$audited_by.'" ,
            "dealer_name" : "'.$dealer_name.'",
            "audited_date": "'.$row[3].'",
            "audited_end_date": "'.$edate.'",
            "total_score": "'.round($dealer_score,2).'",
            "more_info": "'.$status_id.'",
            "info_path": "url"
        },';

	}

	$str1 = substr($str1,0,-1);


    $str .= $str1."]}";


	echo $str;
}

function startNewAudit(){
	$txtDealer = $_POST["txtDealer"];

	$table = "dss_audits";
	$fields = "auditor_id,dealer_id,datetime";

	$value = $_SESSION['USER_ID'].",".$txtDealer.",'".date("Y-m-d H:i:s",time())."'";

	if(insertrec($table,$fields,$value)){
		$recID = mysql_insert_id();	
		//echo $recID;
		$txtAuditDate = singlefield("datetime","dss_audits","audit_id=".$recID);
		$name = singlefield("first_name", "auth_user", "id=".$txtDealer). " ".singlefield("last_name", "auth_user", "id=".$txtDealer);
		$dealer_code = singlefield("dealer_id","gm_dealer","user_id=".$txtDealer);


		$arr = array('dealer_name' => $name,'dealer_id'=>$txtDealer, 'dealer_code' =>  $dealer_code, 'audited_date'=>"'".$txtAuditDate."'");

		$arr = '{
		    '.default_headers("brand").',
		    "type": "Dealer Audit Dashboard",
		    "dealer_name" : "'.$name.'",
		    "dealer_id" : "'.$txtDealer.'",
		    "audit_id" : "'.$recID.'",
		    "dealer_code" : "'.$dealer_code.'",
		    "audit_date" : "'.$txtAuditDate.'",
		    "adherence" : "0",
		    "max_score" : "'.getMaxTotal($recID).'",
		    "editable":"1",
		    "dealer_score" : "0",
		    "details": [';


		$fields = "dss_id,dss_name,icon";
		$table = "dss_dssids";
		$cond = "active=1";
		$arr .= fetchAuditData($fields,$table,$cond,$txtDealer,$recID);

		$arr = substr($arr,0,-1);
		$arr .='}]}';
		
	}

	echo $arr;
}

$finalTotal = 0;
$max_score = 0;

function getMaxTotal($audit_id){

	$fields = "dss_id,dss_name,icon";
	$table = "dss_dssids";
	$cond = "active=1";

	$rows = selectrec($fields,$table,$cond);
	$arr= "";

	global $max_score;

	foreach ($rows as $row) {

			$totalData = calculateTotal($audit_id,$row[0]);
			$max_score 		+= $totalData["max_score"];
	}

	return $max_score;



}


function fetchAuditDataPage(){
	global $finalTotal;
	global $max_score;

	$audit_id = $_GET["auditID"];

	$txtDealer = singlefield("dealer_id","dss_audits","audit_id=".$audit_id);
	$txtAuditDate = singlefield("datetime","dss_audits","audit_id=".$audit_id);
	

	// $max_score = "1000";//singlefield("sum(max_score)","dss_questions");

	$dealer_score = singlefield("sum(dealer_score)","dss_answers","audit_id=".$audit_id);
	$dealer_score = $dealer_score + singlefield("sum(dealer_score)","dss_answers_sub_category","audit_id=".$audit_id);
	$dealer_score = $dealer_score + singlefield("total_dealer_score","dss_answers_manpower","audit_id=".$audit_id);
	
	$fields = "dss_id,dss_name,icon";
	$table = "dss_dssids";
	$cond = "active=1";

	$arr1 =fetchAuditData($fields,$table,$cond,$txtDealer,$audit_id);	

	$adherence = ($dealer_score>=1)?(round(($finalTotal/$max_score)*100,2))."%":"";

	$dealer_name = singlefield("first_name", "auth_user", "id=".$txtDealer). " ".singlefield("last_name", "auth_user", "id=".$txtDealer);
	$dealer_code = singlefield("dealer_id","gm_dealer","user_id=".$txtDealer);

	$arr = '{
	    '.default_headers("brand").',
	    "type": "Dealer Audit Dashboard",
	    "dealer_name" : "'.$dealer_name.'",
	    "dealer_id" : "'.$txtDealer.'",
	    "audit_id" : "'.$audit_id.'",
	    "dealer_code" : "'.$dealer_code.'",
	    "audit_date" : "'.$txtAuditDate.'",
	    "adherence" : "'.round($adherence,2).'%",
	    "max_score" : "'.round($max_score,2).'",
	    "dealer_score" : "'.round($finalTotal,2).'",
	    "editable" : "'.(singlefield("status","dss_audits","audit_id=".$audit_id)=="1"?"0":"1").'",
	    "details": [';


		$arr .= $arr1;


		$arr .=']}';
		echo $arr;
}

$hasTxt = "";

//Fetch accordion data along with its questions
function fetchQuestions(){

	$typeID = $_GET["typeID"];
	$auditID = $_GET["audit_id"];

	$fields = "question_id,question_name,sub_heading_id,max_score,has_text";
	$table = "dss_questions";
	$cond = "active=1 and process_id=".$typeID;
	//$rows = selectrec($fields,$table,$cond);

	if($typeID=="1")
		$field = "pro_status";
	else if($typeID =="2")
		$field = "man_status";
	else if($typeID =="3")
		$field = "too_status";
	else if($typeID =="4")
		$field = "inf_status";


	$dealerID = singlefield("dealer_id","dss_audits","audit_id=".$auditID);
	$editable = singlefield($field,"dss_audits","audit_id=".$auditID);

	$submitted = singlefield("status","dss_audits","audit_id=".$auditID);

	$editable = ($editable=="2")?"1":"0";
	$dealer_name = singlefield("first_name", "auth_user", "id=".$dealerID). " ".singlefield("last_name", "auth_user", "id=".$dealerID);

	$str = '{
			    "dealer_id": "'.$dealerID.'",
			    "dealer_name": "'.$dealer_name.'",
			    "audited_date": "'.singlefield("datetime","dss_audits","audit_id=".$auditID).'",
			    "editable": "'.$editable.'",
			    "audit_type": "'.singlefield("dss_name","dss_dssids","dss_id=".$typeID).'",
			    "type_id": "'.$typeID.'",
			    "process": [';

    //$rows1 = selectrec("sub_heading_id","questions","active=1 and sub_heading_id>=1 GROUP BY sub_heading_id");

    $rows = selectrec("process_id,process_name","dss_process","active=1 and dss_id=".$typeID);
    
    foreach ($rows as $row) {
    

		$questionIDS = "";

		$totalValues = calAverage($auditID, $row[0]);

		$total_score = $totalValues["totalScore"];
		$dealer_score = $totalValues["dealerScore"];
		$adherence = $totalValues["adherence"];	

		$hasTxt = singlefield("has_text","dss_questions","process_id =".$row[0]);

		$str .= '{

			"technician_name": "'.singlefield("technician_name","dss_answers_technician_details","active=1 and audit_id=".$auditID." and process_id =".$row[0]).'",
			"reg_no":"'.singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$auditID." and process_id=".$row[0]).'",
			"type_name": "'.$row[1].'",
			"id": "'.$row[0].'",
	        "weightage": "'.$total_score.'",
	        "total_score": "'.round($dealer_score,2).'",
	        "adherence": "'.round($adherence,2).'%",
	        "has_text": "'.$hasTxt.'",
			"headings":[ ';

			//For Individual Questions following if else conditions

			if($row[0]=="6"){
					$str .=getSubHeaders($row[0],$auditID,$editable);
			}
			else if($row[0]=="5" || $row[0]=="13"){
					$str .=getModelHeaders($row[0],$auditID,$editable);
			}
			else{
				$typeID = "";
	    		$str .= getQuestionsAnswers($row[0],$row,$auditID);
	    		$str .=']';
			}
			$str .="},";
    }

	$str = substr($str,0,-1);		      
	$str = $str.']}';

	echo $str;
} 

function getQuestionsList($typeID="",$row,$auditID,$sub_heading_id="",$modelID="") {
	$newCond = "";
	$subHeading = "";
	$groupBy = ""; 
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
    		
			$str .= '{

					"questions": [ ';

	        $rows2 = selectrec("question_id,question_name,process_id","dss_questions_repair_sop","active=1".$newCond1." and process_id=".$row[0]);
	        $str1 = "";

	        foreach ($rows2 as $row2) {
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str1 .='{
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'"
	                    ';

	            if($typeID!="12"){
	        		$table1 = "dss_answers";
		            $answerID = singlefield("answer_id",$table1,"question_id=".$row2[0]." and audit_id=".$auditID);
		        }
		        else{
	        		$table1 = "dss_answers_customers";
	            	$answerID = singlefield("answer_id",$table1,"question_id=".$row2[0]." and audit_id=".$auditID);

		            if($answerID){
		            	$str1 .='"customer_name":"'.singlefield("cust_name",$table1,"answer_id=".$answerID).'",
		            			';
		            }
		            else{
		            	$str1 .='"customer_name": "",
		            			';
		            }

		            if($answerID){
		            	$str1 .='"customer_phone":"'.singlefield("cust_phone",$table1,"answer_id=".$answerID).'",
		            			';
		            }
		            else{
		            	$str1 .='"customer_phone": "",
		            			';
		            }

		        }

	            // if($answerID){
	            // 	$str1 .='"answer":"'.singlefield("dealer_score",$table1,"answer_id=".$answerID).'",
	            // 			';
	            // }
	            // else{
	            // 	$str1 .='"answer": "",
	            // 			';
	            // }

	            // $str1 .='"marks": "'.$row2[3].'",';


	            // if($answerID){
	            // 	$str1 .='"remarks":"'.singlefield("audit_remarks",$table1,"answer_id=".$answerID).'"
	            // 			';
	            // }
	            // else{
	            // 	$str1 .='"remarks": ""
	            // 			';
	            // }


	            $str1 .='},';
	        }
	        $str1 = substr($str1,0,-1);
			$str .= $str1.']},';

		//}

	$str = substr($str,0,-1);
	

	return $str;	
}

function getQuestionsAnswers($typeID="",$row,$auditID,$sub_heading_id="",$modelID="",$relCounter=1){

	$newCond = "";
	$subHeading = "";
	$groupBy = ""; 
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

	// echo $newCond1;

    //$headings = selectrec("sub_heading_id","dss_questions","active=1 and process_id=".$row[0].$newCond1.$groupBy);

    	//foreach ($headings as $heading) {
    		
			$str .= '{
					"technician_name":"'.singlefield("technician_name","dss_answers_technician_details", "active=1 ".$newCond1." and process_id=".$row[0]." and audit_id=".$auditID." and relCount=".$relCounter).'",
					"reg_no":"'.singlefield("reg_no","dss_answers_reg_no", "active=1 ".$newCond1." and process_id=".$row[0]." and audit_id=".$auditID." and relCount=".$relCounter).'",
					"comments":"'.singlefield("other_details","dss_answers_comments", "active=1 ".$newCond1." and process_id=".$row[0]." and audit_id=".$auditID." and relCount=".$relCounter).'",
					"relCount":"'.$relCounter.'",
					"questions": [ ';
			//echo $newCond1;

	        $rows2 = selectrec("question_id,question_name,process_id,max_score,ranger","dss_questions","active=1".$newCond1." and process_id=".$row[0]);
	        $str1 = "";

	        foreach ($rows2 as $row2) {
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str1 .='{
	            		"isRanger":"'.$row2[4].'",
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'",
	                    ';
		        

		        //To check if its in Direct Feedback from Customers (11)
	           
	            $isNA = "";
	            if($typeID!="12"){
	        		$table1 = "dss_answers";
		            $answerID = singlefield("answer_id",$table1,"question_id=".$row2[0]." and audit_id=".$auditID." and relCount=".$relCounter);

		        }
		        else{
	        		$table1 = "dss_answers_customers";
	            	$answerID = singlefield("answer_id",$table1,"question_id=".$row2[0]." and audit_id=".$auditID." and relCount=".$relCounter);

		            if($answerID){
		            	$str1 .='"customer_name":"'.singlefield("cust_name",$table1,"answer_id=".$answerID." and relCount=".$relCounter).'",
		            			';
		            }
		            else{
		            	$str1 .='"customer_name": "",
		            			';
		            }

		            if($answerID){
		            	$str1 .='"customer_phone":"'.singlefield("cust_phone",$table1,"answer_id=".$answerID." and relCount=".$relCounter).'",
		            			';
		            }
		            else{
		            	$str1 .='"customer_phone": "",
		            			';
		            }

		        }



	            if($answerID){
	            	$str1 .='"answer":"'.singlefield("dealer_score",$table1,"answer_id=".$answerID." and relCount=".$relCounter).'",
	            			"isNA":"'.singlefield("nafield",$table1,"answer_id=".$answerID." and relCount=".$relCounter).'",
	            			';
	            }
	            else{
	            	$str1 .='"answer": "",
	            			"isNA": "",
	            			';
	            }
	                    


	            $str1 .='"marks": "'.$row2[3].'",';


	            if($answerID){
	            	$remarks = str_replace(array("\n", "\r"), "&#10;", singlefield("audit_remarks",$table1,"answer_id=".$answerID." and relCount=".$relCounter));
	            	$remarks = str_replace("&#10;&#10;", "&#10;", $remarks);
	            	$str1 .='"remarks":"'.$remarks.'"
	            			';
	            }
	            else{
	            	$str1 .='"remarks": ""
	            			';
	            }


	            $str1 .='},';
	        }
	        $str1 = substr($str1,0,-1);
			$str .= $str1.']},';

		//}

	$str = substr($str,0,-1);
	

	return $str;
}

function customersList(){
	$auditID = $_POST["auditID"];
	$questionIDs = $_POST["questionID"];


	//For adding the save Status.
	$dss_id = $_POST["dssID"];		
	$processID = $_POST["processID"];		
	$cond = "dss_id=".$dss_id." and process_id=".$processID." and audit_id=".$auditID;
	if(!(singlefield("id","dss_submit_status",$cond))){
		$table = "dss_submit_status";
		$fields = "dss_id,process_id,audit_id";
		$value = $dss_id.",".$processID.",".$auditID;
		insertrec($table,$fields,$value);
	}



	$txtCustNames = $_POST["txtCustName"];
	$txtCustPhones = $_POST["txtCustPhone"];
	$txtDealerScores =  $_POST["txtDealerScore"];
	$auditRemarks =  $_POST["auditRemarks"];

	$fields = "question_id,cust_name,cust_phone,dealer_score,audit_remarks,audit_id";
	$table = "dss_answers_customers";



	$i=0;

	foreach ($txtCustNames as $txtCustName) {

		$questionID = $questionIDs[$i];
		$txtCustName = $txtCustNames[$i];
		$txtCustPhone = ($txtCustPhones[$i]=="")?"":$txtCustPhones[$i];
		$txtDealerScore =  $txtDealerScores[$i];
		$auditRemark =  htmlspecialchars($auditRemarks[$i],ENT_QUOTES);


		$answerID = singlefield("answer_id",$table,"question_id=".$questionID." and audit_id=".$auditID);

		if($answerID){
			$cond = "answer_id=".$answerID;
			$col_val = "cust_name='".$txtCustName."', cust_phone='".$txtCustPhone."', dealer_score=".$txtDealerScore.", audit_remarks='".$auditRemark."'";
			updaterecs($table,$col_val, $cond);
		}
		else{
			$value = $questionID.",'".$txtCustName."','".$txtCustPhone."',".$txtDealerScore.",'".$auditRemark."',".$auditID;
			insertrec($table,$fields,$value);
		}
		$i++;
	}
	
	$arr = array('status' => 1, 'message' => 'Success');
	echo json_encode($arr);
}

function answersList_subHeaders(){
 	$auditID = $_POST["auditID"];



	//For adding the save Status.
	$dss_id = $_POST["dssID"];		
	$processID = $_POST["processID"];		
	$cond = "dss_id=".$dss_id." and process_id=".$processID." and audit_id=".$auditID;
	if(!(singlefield("id","dss_submit_status",$cond))){
		$table = "dss_submit_status";
		$fields = "dss_id,process_id,audit_id";
		$value = $dss_id.",".$processID.",".$auditID;
		insertrec($table,$fields,$value);
	}


	$questionIDs = $_POST["questionID"];
	$dealerScores = $_POST["dealerScore"];
	$auditRemarks = $_POST["auditRemarks"];

	$table = "dss_answers_sub_category";

	$fields = "question_id, dealer_score, audit_remarks, audit_id";
	$chkfields = "question_id, audit_id";

	$count=0;
	foreach ($questionIDs as $questionID) {

	$answerID = singlefield("answer_id",$table,"question_id=".$questionID." and audit_id=".$auditID);


	if($answerID){

	$cond = "answer_id=".$answerID;

	$dScore = $dealerScores[$count];

	if($dScore == "reset")
		$dScore = "NULL";


	$col_val = "dealer_score=".$dScore.", audit_remarks='".htmlspecialchars($auditRemarks[$count],ENT_QUOTES)."'";
	updaterecs($table,$col_val, $cond);
	}
	else{

	if($dealerScores[$count]=="NaN"){
	$fields = "question_id, audit_remarks, audit_id";
	$value = $questionID.",'".htmlspecialchars($auditRemarks[$count],ENT_QUOTES)."',".$auditID;
	}
	else{
	$dScore = $dealerScores[$count];
	$value = $questionID.",".$dScore.",'".htmlspecialchars($auditRemarks[$count],ENT_QUOTES)."',".$auditID;
	}

	insertrec($table,$fields,$value);

	}

	$count++;


	}
	$arr = array('status' => 1, 'message' => 'Success');
	unset($count);
	echo json_encode($arr);
}

function answersList(){
	$auditID = $_POST["auditID"];

		if(isset($_POST["processID"]))
			$processID 		= $_POST["processID"];
		else
			$processID 		= "";

		if(isset($_POST["modelID"]))
			$modelID 		= $_POST["modelID"];
		else
			$modelID 		= "";
		
		if(isset($_POST["subHeadingID"]))
			$subHeadingID 	= $_POST["subHeadingID"];
		else
			$subHeadingID	= "";

		if(isset($_POST["relCounter"]))
			$relCounter 	= $_POST["relCounter"];
		else
			$relCounter	= "1";

		if($subHeadingID=="")
			$subHeadingID = "''";

		if($modelID=="")
			$modelID = "''";


	$dss_id = $_POST["dssID"];		
	$cond = "dss_id=".$dss_id." and process_id=".$processID." and audit_id=".$auditID;
	if(!(singlefield("id","dss_submit_status",$cond))){
		$table = "dss_submit_status";
		$fields = "dss_id,process_id,audit_id";
		$value = $dss_id.",".$processID.",".$auditID;
		insertrec($table,$fields,$value);
	}




	if(isset($_POST["technicianName"])){
		$technicianName = htmlspecialchars($_POST["technicianName"],ENT_QUOTES);


		$cond = "audit_id=".$auditID." and process_id = ".$processID." and model_id = ".$modelID." and sub_heading_id = ".$subHeadingID." and relCount = ".$relCounter;
		// echo $cond;

		$table = "dss_answers_technician_details";

		if(selectrec("t_id",$table,$cond)){
			$col_val = "technician_name='".$technicianName."'";
			updaterecs($table,$col_val, $cond);
		}
		else{
			$fields = "audit_id, process_id, model_id, sub_heading_id, technician_name, relCount";
			$value = $auditID.", ".$processID.", ".$modelID.", ".$subHeadingID.", '".$technicianName."',".$relCounter;
			insertrec($table,$fields,$value);
		}
	}

	if(isset($_POST["reg_no"])){
		$reg_no = htmlspecialchars($_POST["reg_no"],ENT_QUOTES);


		$cond = "audit_id=".$auditID." and process_id = ".$processID." and model_id = ".$modelID." and sub_heading_id = ".$subHeadingID." and relCount = ".$relCounter;
		// echo $cond;

		$table = "dss_answers_reg_no";

		if(selectrec("reg_id",$table,$cond)){
			$col_val = "reg_no='".$reg_no."'";
			updaterecs($table,$col_val, $cond);
		}
		else{
			$fields = "audit_id, process_id, model_id, sub_heading_id, reg_no, relCount";
			$value = $auditID.", ".$processID.", ".$modelID.", ".$subHeadingID.", '".$reg_no."', ".$relCounter;
			insertrec($table,$fields,$value);
		}
	}

	if(isset($_POST["commentsArea"])){

		$commentsArea = htmlspecialchars($_POST["commentsArea"],ENT_QUOTES);

		$cond = "audit_id=".$auditID." and process_id = ".$processID." and model_id = ".$modelID." and sub_heading_id = ".$subHeadingID." and relCount = ".$relCounter;
		// echo $cond;

		$table = "dss_answers_comments";

		if(selectrec("o_id",$table,$cond)){
			$col_val = "other_details='".$commentsArea."'";
			updaterecs($table,$col_val, $cond);
		}
		else{
			$fields = "audit_id, process_id, model_id, sub_heading_id, other_details, relCount";
			$value = $auditID.", ".$processID.", ".$modelID.", ".$subHeadingID.", '".$commentsArea."', ".$relCounter;
			insertrec($table,$fields,$value);
		}
	}


	$questionIDs = $_POST["questionID"];


	$dealerScores = $_POST["dealerScore"];

	//This is for the NA Field

	//1 is for Yes, 2 is for No and 3 is for NA
	if(isset($_POST["dealerselect"]))
		$nafield = $_POST["dealerselect"];
	else
		$nafield = 0;

	if(isset($_POST["auditRemarks"]))
		$auditRemarks = $_POST["auditRemarks"];
	else
		$auditRemarks = "";

	$table = "dss_answers";

	$fields = "question_id, dealer_score, audit_remarks, audit_id, nafield, relCount";
	$chkfields = "question_id, audit_id";

	$count=0;
	foreach ($questionIDs as $questionID) {
		$answerID = singlefield("answer_id",$table,"question_id=".$questionID." and audit_id=".$auditID." and relCount=".$relCounter);
		
		$dScore = $dealerScores[$count];
		$na_field = $nafield[$count];

		if($na_field == 'NaN')
			$na_field = 0;

		if((!isset($dScore)) || $dScore=="")
			$dScore = 0;

		if((!isset($na_field)) || $na_field=="")
			$na_field = 0;



		if($dScore == "reset")
			$dScore = "NULL";

		if(isset($auditRemarks[$count]))
			$audit_remarks = htmlspecialchars($auditRemarks[$count],ENT_QUOTES);
		else
			$audit_remarks = "";

		if($answerID){

			$cond = "answer_id=".$answerID." and relCount = ".$relCounter;
			$col_val = "dealer_score=".$dScore.", audit_remarks='".$audit_remarks."', nafield=".$na_field;
			updaterecs($table,$col_val, $cond);
		}
		else{

			if($dealerScores[$count]=="NaN"){
				$fields = "question_id, audit_remarks, audit_id, nafield, relCount";
				$value = $questionID.",'".$audit_remarks."',".$auditID.",".$na_field.",".$relCounter;
			}
			else{
				$dScore = $dealerScores[$count];
				$value = $questionID.",".$dScore.",'".$audit_remarks."',".$auditID.",".$na_field.",".$relCounter;
			}
			
			insertrec($table,$fields,$value);
			// echo "insert into `".$table ."` (". $fields .") VALUES (". $value .")";
		}

		$count++;


	}
	$arr = array('status' => 1, 'message' => 'Success');
	unset($count);
	echo json_encode($arr);
}

function answersList1(){
	$auditID = $_POST["auditID"];

	$questionIDs = $_POST["questionID"];
	$dealerScores = $_POST["dealerScore"];
	$auditRemarks = $_POST["auditRemarks"];
	$relCounter = $_POST["relCounter"];

	$table = "dss_answers";

	$fields = "question_id, dealer_score, audit_remarks, audit_id, relCount";
	$chkfields = "question_id, audit_id";

	$count=0;
	foreach ($questionIDs as $questionID) {
		$answerID = singlefield("answer_id",$table,"question_id=".$questionID." and audit_id=".$auditID." and relCount = ".$relCounter);


		$dScore = $dealerScores[$count];
		
		if($dScore == "reset")
			$dScore = "NULL";
		
		if($answerID){

			$cond = "answer_id=".$answerID;
			$col_val = "dealer_score=".$dScore.", audit_remarks='".htmlspecialchars($auditRemarks[$count],ENT_QUOTES)."'";
			updaterecs($table,$col_val, $cond);
		}
		else{

			$value = $questionID.",".$dealerScores[$count].",'".htmlspecialchars($auditRemarks[$count],ENT_QUOTES)."',".$auditID.",".$relCounter;
			insertrec($table,$fields,$value);

		}

		$count++;


	}
	$arr = array('status' => 1, 'message' => 'Success');
	unset($count);
	echo json_encode($arr);
}

function submitQuestionnaire(){
	$auditID = $_GET["auditID"];
	$qID = $_GET["qID"];

	$table = "dss_audits";
	if($qID=="0"){
		$col_val = "status = 1, pro_status=1, man_status=1, too_status=1, inf_status=1";
		$col_val .=", stat_timestamp='".date("Y-m-d H:i:s",time())."'";
	}

	if($qID=="1"){
		$col_val = "pro_status = 1";
		$col_val .=", pro_timestamp='".date("Y-m-d H:i:s",time())."'";
	}

	if($qID=="2"){
		$col_val = "man_status = 1";
		$col_val .=", man_timestamp='".date("Y-m-d H:i:s",time())."'";
	}

	if($qID=="3"){
		$col_val = "too_status = 1";
		$col_val .=", too_timestamp='".date("Y-m-d H:i:s",time())."'";
	}

	if($qID=="4"){
		$col_val = "inf_status = 1";
		$col_val .=", inf_timestamp='".date("Y-m-d H:i:s",time())."'";
	}

	$cond = "audit_id=".$auditID;

	if( updaterecs($table,$col_val, $cond)){
		if( (singlefield("pro_status",$table,$cond)==1) and (singlefield("man_status",$table,$cond)==1) and (singlefield("too_status",$table,$cond)==1) and (singlefield("inf_status",$table,$cond)==1)){
			
			updaterecs($table,"status = 1, stat_timestamp='".date("Y-m-d H:i:s",time())."'", $cond);

			//Send Emails
			$dealer_id = singlefield("dealer_id","dss_audits","audit_id=".$auditID);
			$auditor_id = singlefield("auditor_id","dss_audits","audit_id=".$auditID);

			$dealerEmail = singlefield("email","auth_user","id=".$dealer_id);
			$auditorEmail = singlefield("email","auth_user","id=".$auditor_id);

			$to = $dealerEmail;
			// $cc = $auditorEmail;

			//Adding even RSM ID
			$zsm_rowID = singlefield("zsm_id","gm_areaservicemanager","user_id=".$auditor_id);
			$zsm_rowID = singlefield("user_id","gm_zonalservicemanager","id=".$zsm_rowID);
			$zsm_emailID = singlefield("email","auth_user","id=".$zsm_rowID);

			$cc = $auditorEmail.",".$zsm_emailID;

			$body = fetchAuditDataPageEmail($auditID);
			$body .= "<hr style='margin:10px 0;'>";
			$body .= showZerosEmail($auditID);

			$txtAudit = singlerec("datetime, dealer_id","dss_audits","audit_id=".$auditID);
			$txtAuditDate = date("F Y", strtotime($txtAudit[0]));
			$dealer_code = singlefield("dealer_id","gm_dealer","user_id=".$txtAudit[1]);

			$subject = "Audit Report ".$txtAuditDate." (Dealer Code: ".$dealer_code.")";

			mailTo($subject,$to,$body,$cc);
			// echo $body;


		}
		$arr = array('status' => 1, 'message' => 'Submitted');
	}
	else{
		$arr = array('status' => 0, 'message' => 'failure');	
	}

	echo json_encode($arr);
}

function sideMenu(){
	$imgURL = $_SESSION['IMAGE_URL'];

	if($imgURL=="")
		$imgURL = "placeholder.jpg";

	$str = '{
	    "brand": "Bajaj",
	    "type": "Digital Service Standards",
	    "header_logo" : "img/Bajaj_Logo.png",
	    "user_name": "'.$_SESSION['NAME'].'",
	    "profile_image": "img/profile_pics/'.$imgURL.'",
	    "id" : "'.$_SESSION['USER_ID'].'",
	    "bg_color" : "#1C92C5",
	    "font_color" : "#FFF",
	    "legend": [
	        {
	            "option_name": "Dashboard",
	            "option_ID" : "dashboard"
	        }
	    ]
	}';

	echo $str;
}

function mainMenu(){

	//echo "hi".$_SESSION['USER_ID'];
	$userID = $_SESSION['USER_ID'];
	$imgURL = $_SESSION['IMAGE_URL'];
	// echo $imgURL

	if($imgURL=="")
		$imgURL = "placeholder.jpg";

	$name = $name = singlefield("first_name", "auth_user", "id=".$userID). " ".singlefield("last_name", "auth_user", "id=".$userID);

	$str = '{
    "brand": "Bajaj",
    "brand_logo" : "img/Bajaj_Logo.png",
    "user":"'.$name.'",
    "profile_img":"img/profile_pics/'.$imgURL.'",
    "id":"'.$_SESSION['USER_ID'].'",
    "type": "landing",
    "list_img" : "arrow_img_path.png",
    "legends": [
        {
            "option_name": "Motorcycles",
            "className":"bajaj-bv-motorcycles",
            "background": "",
            "border" : "",
            "img_path" : "img/banner_2_zingzong.jpg",
            "font_color":  "",
            "url":[
                {
                    "name":"Dealership Service Standards",
                    "href":"dss.html"
                }]
        },
		{
            "option_name": "Commercial Vechicle",
            "className":"bajaj-bv-commercialVehicle",
            "background": "",
            "border" : "",
            "img_path" : "img/Range_Yellow-re.jpg",
            "font_color":  "",
            "url":[
                {
                    "name":"Parts Ready Rockoner",
                    "href":"#"
                },
            	{
            		"name":"Loyalty",
            		"href":"#"
            	},
            	{
            		"name":"Electronic Parts Catalog",
            		"href":"#"
            	}]
        },
		{
            "option_name": "International Business",
            "className":"bajaj-bv-internaltionBusiness",
            "background": "",
            "border" : "",
            "img_path" : "img/Bajaj_Bike.gif",
            "font_color":  "",
            "url":[
            	{
            		"name":"Electronic Parts Catalog",
            		"href":"#"
            	}]
        },
		{
            "option_name": "Probiking",
            "className":"bajaj-bv-probiking",
            "background": "",
            "border" : "",
            "img_path" : "img/ktm_pic2.gif",
            "font_color":  "",
            "url":[
            	{
            		"name":"Electronic Parts Catalog",
            		"href":"#"
            	}]
        }
    ]
	}';

	echo $str;
}

function _getSubHeaders($pid,$audit_id,$editable){
	
	$fields = "sub_heading_id,sub_heading_name";
	$table = "dss_sub_heading";
	$cond = "active=1 and process_id=".$pid;
	$rows = selectrec($fields,$table,$cond);
	$str1 ='';

	$qids = selectrec("question_id","dss_answers","audit_id=".$audit_id);
	
	$questionIDs = "";
	foreach ($qids as $qid) {
		$questionIDs .= $qid[0].",";
	}
	

	//echo  $questionIDs;
	$questionIDs = rtrim($questionIDs, ',');
	//echo $questionIDs;

		$qstr = "";

	if($questionIDs!="")
		$qstr = "and question_id in(".$questionIDs.")";

	$selectedSubHeadingID = selectrec("sub_heading_id","dss_questions","active=1 ".$qstr." GROUP BY sub_heading_id");


	// foreach($selectedSubHeadingIDs as $selectedSubHeadingID){ 
	// 	echo "Karthik".print_r($selectedSubHeadingID[0]);
	// }
	$savedCount = 0;
	foreach($rows as $row){ 



		if(in_array($row[0],getHeaderIDs($audit_id,$pid))){
			$str1 .='{"selected":"1",';
			$savedCount++;
		}
		else
			$str1 .='{"selected":"0",';

			$comments = singlefield("other_details","dss_answers_comments", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid);

			$str1 .='"sub_heading_id":"'.$row[0].'","sub_heading_name":"'.$row[1].'",
			"technician_name":"'.singlefield("technician_name","dss_answers_technician_details", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid).'",
			"reg_no":"'.singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid).'",';
			
			if($comments!="")
				$str1 .= '"comments":"'.$comments.'",';
			
			$str1 .='"questions":[';
			$str2 = "";
			if($editable=="0"){

				if(singlefield("status","dss_audits","audit_id=".$audit_id)=="1")
					$cond = "active=1 and process_id=".$pid." ".$qstr;
				else
					$cond = "active=1 and sub_heading_id=".$row[0]." and process_id=".$pid;

		        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions",$cond);
		        


		        foreach ($rows2 as $row2) {
		            $question = str_replace('"',"'",$row2[1]);
		            $question = preg_replace("/[\r\n]+/", "\n", $question);

		            $str2 .='{
		                    "question": "'.$question.'",
		                    "question_id": "'.$row2[0].'",
		                    "marks": "'.$row2[3].'",
		                    "answer":"'.singlefield("dealer_score","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id).'",
		                    "remarks":"'.singlefield("audit_remarks","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id).'"';
		            
		            $str2 .='},';
		        }
		        $str2 = substr($str2,0,-1);

		    }


		$str1 .= $str2.']},';
	}

	$str1 = substr($str1,0,-1);


    $str1 = $str1.'],"savedCount":"'.$savedCount.'"';

    return $str1;
}

function getSubHeaders($pid,$audit_id,$editable){
	$str1 = $SHIds = "";
	if($editable=="0"){
		//Fetch All the QIDS from the Answer table
		$qIds = commaSeperated("question_id","dss_answers","audit_id=".$audit_id);
		//Fetch all the SubHeader IDs
		// $SHIds = commaSeperated("sub_heading_id","dss_questions","question_id in(".$qIds.") and sub_heading_id!=0 and process_id=".$pid);

		$SHIds = singlerec("GROUP_CONCAT(sub_heading_id)","dss_questions","question_id in(".$qIds.") and sub_heading_id!=0 and process_id=".$pid);
	}
	else{

		$SHIds = singlerec("GROUP_CONCAT(sub_heading_id)","dss_sub_heading","active=1 and process_id=".$pid);
	}

	$subCond = "";
	if($SHIds!=""){
		$tags = explode( ',', $SHIds[0] );
		$SHIds = array_values( array_unique( $tags ) );
		$SHIds = implode( ',', $SHIds );
		$str1 = "";
		$subCond = " and sub_heading_id in(".$SHIds.")";
	}
		// print_r($SHIds);


	$fields = "sub_heading_id,sub_heading_name";
	$table = "dss_sub_heading";
	$cond = "active=1 and process_id=".$pid.$subCond;
	$rows = selectrec($fields,$table,$cond);




	$savedCount = 0;
	foreach($rows as $row){ 

		$relCounter = 0;
		$qstr = "";

		$qIds = commaSeperated("question_id","dss_questions","sub_heading_id in(".$row[0].") and sub_heading_id!=0 and process_id=".$pid);
		// echo $qIds;

		// if($SHIds[1]!="")
			$qstr = "and question_id in(".$qIds.")";

    	$relCounts = selectrec("relCount","dss_answers","active=1 ".$qstr." and audit_id=".$audit_id." GROUP BY relCount");
    	// print_r($relCounts);
    	if (count($relCounts)==0)
    		$relCounts[0][0] = 1;

		$selected = 0;
		for($relCount=0; $relCount<count($relCounts); $relCount++){
			// echo count($relCounts)."----".$relCount."<br>";
    		$relCounter++;

			if(in_array($row[0],getHeaderIDs($audit_id,$pid,$relCounts[$relCount][0]))){
				$selStr ='{"selected":"1",';
				$selected = 1;
				$savedCount++;
			}
			else{
				$selStr ='{"selected":"0",';
			}
				$stra = "";

				$comments = singlefield("other_details","dss_answers_comments", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]);
				$regNo = singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]);
				if($selected)
					$regNoStr = " - (Reg No: ".$regNo.")";
				else
					$regNoStr = "";

				// if($editable || ($editable=="0" && $selected == 1)){
					$str1 .= $selStr;

					$stra .='"sub_heading_id":"'.$row[0].'","sub_heading_name":"'.$row[1].$regNoStr.'",
							"technician_name":"'.singlefield("technician_name","dss_answers_technician_details", "active=1 and audit_id=".$audit_id." and sub_heading_id=".$row[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]).'",
							"reg_no":"'.$regNo.'",
							"relCount":"'.$relCounts[$relCount][0].'",';
				// }


	            	$comments = str_replace(array("\n", "\r"), "&#10;", $comments);
	            	$comments = str_replace("&#10;&#10;", "&#10;", $comments);


				if($comments!="")
					$stra .= '"comments":"'.$comments.'",';
				
				$stra .='"questions":[';
				$str2 = "";
				
				//For Submitted Audits
		   		// if($editable || ($editable=="0" && $selected == 1)){

					if(singlefield("status","dss_audits","audit_id=".$audit_id)=="1")
						$cond = "active=1 and process_id=".$pid." ".$qstr;
					else
						$cond = "active=1 and sub_heading_id=".$row[0]." and process_id=".$pid;

			        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions",$cond);
			        


			        foreach ($rows2 as $row2) {
							
				            $question = str_replace('"',"'",$row2[1]);
				            $question = preg_replace("/[\r\n]+/", "\n", $question);


			            	$remarks = str_replace(array("\n", "\r"), "&#10;", singlefield("audit_remarks","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id." and relCount=".$relCounts[$relCount][0]));
			            	$remarks = str_replace("&#10;&#10;", "&#10;", $remarks);


				            $str2 .='{
					                    "question": "'.$question.'",
					                    "question_id": "'.$row2[0].'",
					                    "marks": "'.$row2[3].'",
					                    "relCount": "'.$relCounts[$relCount][0].'",
					                    "answer":"'.singlefield("dealer_score","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id." and relCount=".$relCounts[$relCount][0]).'",
					                    "remarks":"'.$remarks.'"';
					            
				            $str2 .='},';

			        }
			        $str2 = substr($str2,0,-1);
			    // }

		    // if($editable || ($editable=="0" && $selected == 1))
					$str1 .= $stra.$str2.']},';

			}
				//For extra Row if the previous is selected
			    if($selected && $editable){

			        $relCounter++;
			    	$stra = "";
			    	$stra .='"sub_heading_id":"'.$row[0].'","sub_heading_name":"'.$row[1].'",
							"technician_name":"",
							"reg_no":"",
							"relCount":"'.$relCounter.'",';
							
	            	$comments = str_replace(array("\n", "\r"), "&#10;", $comments);
	            	$comments = str_replace("&#10;&#10;", "&#10;", $comments);
							
					if($comments!="")
						$stra .= '"comments":"'.$comments.'",';
					
					$stra .='"questions":[';

			    	$str1 .= '{"selected":"0",'.$stra.$str2.']},';

			    }
	}

	$str1 = substr($str1,0,-1);

    $str1 = $str1.'],"savedCount":"'.$savedCount.'"';

    return $str1;
}

function getModelHeaders($pid,$audit_id, $editable){
	//echo "Karthik".$pid;

	$modelIDs = selectrec("model_id","dss_questions","active=1 and process_id=".$pid." group by model_id");
	// echo "select model_id from dss_questions where active=1 and process_id=".$pid." group by model_id"."<br/>";

	$str1 ='';
	$savedCount = 0;
	

	foreach($modelIDs as $modelID){
		// echo "YES ".$modelID[0]."<br/>";
		$relCounter = 0;

		$fields = "model_id,model_name";
		$table = "vehicle_models";

		if($modelID[0]!="")
			$cond = "active=1 and model_id=".$modelID[0];
		else
			$cond = "active=1";

		$rows = singlerec($fields,$table,$cond);


		// $qIds = singlefield("GROUP_CONCAT(question_id)","dss_questions","model_id =".$modelID[0]." and process_id=".$pid);

		$questionsIDs = selectrec("question_id","dss_questions","model_id =".$modelID[0]." and process_id=".$pid);
		
		$qIds = "";
		foreach ($questionsIDs as $questionsID) {
			$qIds .= $questionsID[0].",";
		}
		

		//echo  $questionIDs;
		$qIds = rtrim($qIds, ',');


		$qstr = "";

		if($modelID[0]!="")
			$qstr = "and question_id in(".$qIds.")";

 
    	$selected = 0;

    	$relCounts = selectrec("relCount","dss_answers","active=1 ".$qstr." and audit_id=".$audit_id." GROUP BY relCount");
    	// print_r($relCounts);
    	if (count($relCounts)==0)
    		$relCounts[0][0] = 1;

		$selected = 0;
		for($relCount=0; $relCount<count($relCounts); $relCount++){

    		// echo $relCount;

    		$relCounter++;
    		
    		// if($pid==13 && $rows[0]==5)
    		// 	echo (in_array($rows[0],getModelIDs($audit_id,$pid)))."<--- Kar";
    		// // echo "$rows[0]<br/>";

    		// print_r(getModelIDs($audit_id,$pid,$relCounts[$relCount][0]))."<br/>";

			if(in_array($rows[0],getModelIDs($audit_id,$pid))){
				$selStr ='{"selected":"1",';
				$selected = 1;
				$savedCount++;
			}
			else{

				$selStr ='{"selected":"0",';
				
			}
			$regNo = singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$audit_id." and model_id=".$modelID[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]);

			if($selected)
				$regNoStr = " - (Reg No: ".$regNo.")";
			else
				$regNoStr = "";

			if($editable || ($editable=="0" && $selected == 1)){
				$str1 .= $selStr;

				$str1 .= ' "sub_heading_id":"'.$rows[0].'","sub_heading_name":"'.$rows[1].$regNoStr.'",
							"technician_name":"'.singlefield("technician_name","dss_answers_technician_details", "active=1 and audit_id=".$audit_id." and model_id=".$modelID[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]).'",
							"reg_no":"'.singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$audit_id." and model_id=".$modelID[0]." and process_id=".$pid." and relCount=".$relCounts[$relCount][0]).'",
							"relCount":"'.$relCounts[$relCount][0].'",
							"questions":[';

			}

	  		$str2 = "";

			if($editable=="0" && $selected == 1){

				$questionIDs = commaSeperated("question_id","dss_answers","audit_id=".$audit_id);


				$qstr = "";

				if($questionIDs!="")
					$qstr = "and question_id in(".$questionIDs.")";


				if(singlefield("status","dss_audits","audit_id=".$audit_id)=="1")
					$cond = "active=1 and process_id=".$pid." ".$qstr." and model_id=".$rows[0];
				else{
					if($rows[0]!="")
						$cond = "active=1 and model_id=".$rows[0];
					else
						$cond = "active = 1";
				}

				// echo $cond."<br/>";

		        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions",$cond);
		      

		        foreach ($rows2 as $row2){
		            $question = str_replace('"',"'",$row2[1]);
		            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            	$remarks = str_replace(array("\n", "\r"), "&#10;", singlefield("audit_remarks","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id." and relCount=".$relCounts[$relCount][0]));
	            	$remarks = str_replace("&#10;&#10;", "&#10;", $remarks);


		            $str2 .='{
		                    "question": "'.$question.'",
		                    "question_id": "'.$row2[0].'",
		                    "marks": "'.$row2[3].'",
		                    "answer":"'.singlefield("dealer_score","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id." and relCount=".$relCounts[$relCount][0]).'",
		                    "remarks":"'.$remarks.'"';
		            
		            $str2 .='},';
		        }
		        $str2 = substr($str2,0,-1);

		    }

		    if($editable || ($editable=="0" && $selected == 1)){
				$str1.=$str2.']';

				$str1.='},';
			}
			
		}

		//For extra Row if the previous is selected
	    if($selected && $editable){

	        $relCounter++;
	    	$stra = "";
	    	$stra .='"sub_heading_id":"'.$rows[0].'","sub_heading_name":"'.$rows[1].'",
					"technician_name":"",
					"reg_no":"",
					"relCount":"'.$relCounter.'",';
					
					
			// if($comments!="")
			// 	$stra .= '"comments":"'.$comments.'",';
			
			$stra .='"questions":[';

	    	$str1 .= '{"selected":"0",'.$stra.$str2.']},';

	    }


	}

	$str1 = substr($str1,0,-1);


	$str1 = $str1.'],"savedCount":"'.$savedCount.'"';

    return $str1;
}

function __getModelHeaders($pid,$audit_id, $editable){
	//echo "Karthik".$pid;


	if($editable=="0"){
		//Fetch All the QIDS from the Answer table
		$qIds = singlefield("GROUP_CONCAT(question_id)","dss_answers","audit_id=".$audit_id);

		//Fetch all the SubHeader IDs
		$mIDS = singlerec("GROUP_CONCAT(model_id)","dss_questions","question_id in(".$qIds.") and model_id!=0 and process_id=".$pid);
	}
	else{

		$mIDS = singlerec("GROUP_CONCAT(model_id)","dss_sub_heading","active=1 and process_id=".$pid);
	}


	$tags = explode( ',', $mIDS[0] );
	$mIDS = array_values( array_unique( $tags ) );
	$mIDS = implode( ',', $mIDS );
	$str1 = "";
	// print_r($mIDS);


	$fields = "model_id,model_name";
	$table = "vehicle_models";
	$cond = "active=1 and model_id in(".$mIDS.")";
	$modelIDs = selectrec($fields,$table,$cond);



	// $modelIDs = selectrec("model_id","dss_questions","active=1 and process_id=".$pid." group by model_id");

	$str1 ='';
	$savedCount = 0;
	foreach($modelIDs as $modelID){
		//echo "YES ".$modelID[0]."<br/>";

		$fields = "model_id,model_name";
		$table = "vehicle_models";
		if($modelID[0]!="")
			$cond = "active=1 and model_id=".$modelID[0];
		else
			$cond = "active=1";

		$rows = singlerec($fields,$table,$cond);
 
		if(in_array($rows[0],getModelIDs($audit_id,$pid))){
			$str1 .='{"selected":"1",';
			$savedCount++;
		}
		else
			$str1 .='{"selected":"0",';

		$str1 .= ' "sub_heading_id":"'.$rows[0].'","sub_heading_name":"'.$rows[1].'",
					"technician_name":"'.singlefield("technician_name","dss_answers_technician_details", "active=1 and audit_id=".$audit_id." and model_id=".$modelID[0]." and process_id=".$pid).'",
					"reg_no":"'.singlefield("reg_no","dss_answers_reg_no", "active=1 and audit_id=".$audit_id." and model_id=".$modelID[0]." and process_id=".$pid).'",
					"questions":[';
  		$str2 = "";

		if($editable=="0"){
			// $qids = selectrec("question_id","dss_answers","audit_id=".$audit_id);
			
			// $questionIDs = "";
			// foreach ($qids as $qid) {
			// 	$questionIDs .= $qid[0].",";
			// }

			$questionIDs = singlerec("GROUP_CONCAT(question_id)","dss_answers","audit_id=".$audit_id);
			

			//echo  $questionIDs;
			// $questionIDs = rtrim($questionIDs, ',');
			//echo $questionIDs;

				$qstr = "";

			if($questionIDs!="")
				$qstr = " and question_id in(".$questionIDs[0].")";


			if(singlefield("status","dss_audits","audit_id=".$audit_id)=="1")
				$cond = "active=1 and model_id=".$rows[0].$qstr;
			else{
				if($rows[0]!="")
					$cond = "active=1 and model_id=".$rows[0];
				else
					$cond = "active = 1";
			}

	        $rows2 = selectrec("question_id,question_name,process_id,max_score","dss_questions",$cond);
	      

	        foreach ($rows2 as $row2){
	            $question = str_replace('"',"'",$row2[1]);
	            $question = preg_replace("/[\r\n]+/", "\n", $question);

	            $str2 .='{
	                    "question": "'.$question.'",
	                    "question_id": "'.$row2[0].'",
	                    "marks": "'.$row2[3].'",
	                    "answer":"'.singlefield("dealer_score","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id).'",
	                    "remarks":"'.singlefield("audit_remarks","dss_answers","question_id=".$row2[0]." and audit_id=".$audit_id).'"';
	            
	            $str2 .='},';
	        }
	        $str2 = substr($str2,0,-1);

	    }
		$str1.=$str2.']';
		$str1.='},';
		
	}

	$str1 = substr($str1,0,-1);


	$str1 = $str1.'],"savedCount":"'.$savedCount.'"';

    return $str1;
}

function getRepairSopData() {
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


	echo getQuestionsList("",$row,$audit_id,$sub_heading_id,$modelID);
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

	if(isset($_GET["relCounter"])){
		$relCounter = $_GET["relCounter"];
		if($relCounter=="undefined")
			$relCounter = "1";
	}
	else
		$relCounter = "1";


	$audit_id = $_GET["audit_id"];
	$pid = $_GET["typeID"];
	$processID = $_GET["processID"];
	$row = array($processID);


	echo getQuestionsAnswers("",$row,$audit_id,$sub_heading_id,$modelID,$relCounter);
}

function getJobRole(){
	$fields = "question_id,question_name,max_score";
	$table = "dss_questions";
	$cond = "active=1 and process_id=17";
	$rows = selectrec($fields,$table,$cond);
	$str ='{"max_score_total":"'.singlefield("sum(max_score)",$table,$cond).'","job_roles":[';
	foreach($rows as $row){ 
		$str .='{"job_id":"'.$row[0].'","job_role":"'.$row[1].'","max_score":"'.$row[2].'","formula":""},';
	}

	$str = substr($str,0,-1);


    $str = $str."]}";

    echo $str;
}

function getSubCategories(){
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
	
	//echo $qstr;
		$total_score = singlefield("sum(dealer_score)","dss_answers_sub_category","active=1 ".$qstr."  and audit_id=".$_GET['auditID']);

		if($weightage==0)
			$weightMock = 1;
		else
			$weightMock = $weightage;


		$adherence = round(($total_score/$weightMock)*100,2)."%";
		


		$str .='{
	            "type_name": "'.$row[1].'",
	            "type_id": "'.$row[0].'",
	            "icon_name": "'.$row[3].'",
	            "more_info": "audit_report_subheader.html?id='.$row[0].'",
	            "legends": [
	                {
	                    "type": "Weightage",
	                    "score": "'.$weightage.'"
	                },
	                {
	                    "type": "Total Score",
	                    "score": "'.$total_score.'"
	                },
	                {
	                    "type": "Adherence",
	                    "score": "'.$adherence.'"
	                }
	            ]
	        },';

	}

	$str = substr($str,0,-1);


    $str = $str."]}";

    echo $str;
}

function getSubCategoryDetails(){

	$subID = $_GET["id"];
	$auditID = $_GET["auditID"];
	$typeID ="3";


	$fields = "question_id,question_name,sub_heading_id,max_score,has_text";
	$table = "dss_questions";
	$cond = "active=1 and process_id=".$typeID;
	//$rows = selectrec($fields,$table,$cond);

	if($typeID=="1")
		$field = "pro_status";
	else if($typeID =="2")
		$field = "man_status";
	else if($typeID =="3")
		$field = "too_status";
	else if($typeID =="4")
		$field = "inf_status";


	$dealerID = singlefield("dealer_id","dss_audits","audit_id=".$auditID);
	$editable = singlefield($field,"dss_audits","audit_id=".$auditID);

	$submitted = singlefield("status","dss_audits","audit_id=".$auditID);

	$editable = ($editable=="2")?"1":"0";
	$dealer_name = singlefield("first_name", "auth_user", "id=".$dealerID). " ".singlefield("last_name", "auth_user", "id=".$dealerID);

	$str = '{
			    "dealer_id": "'.$dealerID.'",
			    "dealer_name": "'.$dealer_name.'",
			    "audited_date": "'.singlefield("datetime","dss_audits","audit_id=".$auditID).'",
			    "editable": "'.$editable.'",
			    "audit_type": "'.singlefield("dss_name","dss_dssids","dss_id=".$typeID).'",
			    "type_id": "'.$typeID.'",
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
			   $total_score = singlefield("sum(dealer_score)","dss_answers_sub_category","active=1 and audit_id=".$auditID." and question_id in(".$question_IDs.")");
			   $adherence = ($total_score/$weightage)*100;
			   $adherence = round($adherence,2);

			$str .= '{
				"accordion_name": "'.$row1[1].'",
				"id": "'.$row1[0].'",
				"adherence": "'.$adherence.'%",
				"weightage": "'.$weightage.'",
				"total_score": "'.$total_score.'",
				"questions": [ ';

			$rows2 = selectrec("sc_question_id,sc_question_name,sc_question_marks,sc_header_id","dss_sub_category_question","active=1 and sc_header_id=".$row1[0]);

			foreach($rows2 as $row2){
				

            	$remarks = str_replace(array("\n", "\r"), "&#10;", singlefield("audit_remarks","dss_answers_sub_category","active=1 and question_id=".$row2[0]." and audit_id=".$auditID));
            	$remarks = str_replace("&#10;&#10;", "&#10;", $remarks);

				$str .= '{
					"question": "'.$row2[1].'",
					"question_id": "'.$row2[0].'",
					"marks": "'.$row2[2].'",
					"dealer_score": "'.singlefield("dealer_score","dss_answers_sub_category","active=1 and question_id=".$row2[0]." and audit_id=".$auditID).'",
					"remarks":"'.$remarks.'"
					},';

			}

			$str = substr($str,0,-1);

			$str .= ']},';

		}

		$str = substr($str,0,-1);

		$str .= ']}';

		echo $str;
}


//Function to get all the Model IDs for an Particular Audit
function getModelIDs($audit_id,$pid,$relCount=""){

	$relStr = "";
	if($relCount!="")
		$relStr = " and relCount=".$relCount." group by question_id";

	$qids = selectrec("question_id","dss_answers","audit_id=".$audit_id.$relStr);
	$questionIDs = "";
	foreach ($qids as $qid) {
		$questionIDs .= $qid[0].",";
	}
	$questionIDs = rtrim($questionIDs, ',');

	// $questionIDs = singlefield("GROUP_CONCAT(question_id)","dss_answers","audit_id=".$audit_id.$relStr." and question_id!=NULL");

	$model_ids = "";

	$qstr = "";

	if($questionIDs){

		$qstr = "and question_id in(".$questionIDs.")";

		$rows2 = selectrec("model_id","dss_questions","active=1 ".$qstr." and process_id=".$pid." group by model_id");
		// $model_ids = singlefield("GROUP_CONCAT(model_id)","dss_questions","active=1 ".$qstr." and process_id=".$pid." group by model_id");

	// echo "Karthik =--> select GROUP_CONCAT(model_id) from dss_questions where active=1 ".$qstr." and process_id=".$pid." group by model_id";


		$model_ids = "";
		foreach ($rows2 as $row2) {
			$model_ids .= $row2[0].",";
		}

		$model_ids = rtrim($model_ids, ',');

	}
	// if($pid==13)
	// echo "<br/>".$model_ids."<br/>";


	return explode(",",$model_ids);
}

function getHeaderIDs($audit_id,$pid,$relCount=""){


	if($relCount!="")
		$relStr = " and relCount=".$relCount." group by question_id";
	else
		$relStr = "";

	$qids = selectrec("question_id","dss_answers","audit_id=".$audit_id.$relStr);
	$questionIDs = "";
	foreach ($qids as $qid) {
		$questionIDs .= $qid[0].",";
	}
	$questionIDs = rtrim($questionIDs, ',');
	$relStr = "";

	// $questionIDs = singlefield("GROUP_CONCAT(question_id)","dss_answers","audit_id=".$audit_id.$relStr." and question_id!=NULL");
	$sub_heading_id = "";

	$qstr = "";
	
	if($questionIDs){
		$qstr = "and question_id in(".$questionIDs.")";


		$rows2 = selectrec("sub_heading_id","dss_questions","active=1 ".$qstr." and process_id=".$pid." group by sub_heading_id");


		$sub_heading_id = "";
		foreach ($rows2 as $row2) {
			$sub_heading_id .= $row2[0].",";
		}
		$sub_heading_id = rtrim($sub_heading_id, ',');
		// $sub_heading_id = singlefield("GROUP_CONCAT(sub_heading_id)","dss_questions","active=1 ".$qstr." and process_id=".$pid." group by sub_heading_id");
	}

	return explode(",",$sub_heading_id);
}

function saveManpower(){

	$txtAMPV = ($_POST["txt_AMPV"]=="")?"NULL":$_POST["txt_AMPV"];
	$txtAMSV = ($_POST["txt_AMSV"]=="")?"NULL":$_POST["txt_AMSV"];

	$txtRow1 = ($_POST["txt_row1"]=="")?"NULL":$_POST["txt_row1"];
	$txtRow2 = ($_POST["txt_row2"]=="")?"NULL":$_POST["txt_row2"];
	$txtRow3 = ($_POST["txt_row3"]=="")?"NULL":$_POST["txt_row3"];
	$txtRow4 = ($_POST["txt_row4"]=="")?"NULL":$_POST["txt_row4"];
	$txtRow5 = ($_POST["txt_row5"]=="")?"NULL":$_POST["txt_row5"];
	$txtRow6 = ($_POST["txt_row6"]=="")?"NULL":$_POST["txt_row6"];
	$txtRow7 = ($_POST["txt_row7"]=="")?"NULL":$_POST["txt_row7"];
	$txtRow8 = ($_POST["txt_row8"]=="")?"NULL":$_POST["txt_row8"];
	$txtRow9 = ($_POST["txt_row9"]=="")?"NULL":$_POST["txt_row9"];
	$txtRow10 = ($_POST["txt_row10"]=="")?"NULL":$_POST["txt_row10"];
	$txtRow11 = ($_POST["txt_row11"]=="")?"NULL":$_POST["txt_row11"];
	$txtRow12 = ($_POST["txt_row12"]=="")?"NULL":$_POST["txt_row12"];
	$txtRow13 = ($_POST["txt_row13"]=="")?"NULL":$_POST["txt_row13"];
	$txtRow14 = ($_POST["txt_row14"]=="")?"NULL":$_POST["txt_row14"];
	$txtRow15 = ($_POST["txt_row15"]=="")?"NULL":$_POST["txt_row15"];
	$manpower_dealerScore = ($_POST["manpower_dealerScore"]=="")?"NULL":$_POST["manpower_dealerScore"];


	$auditID = $_POST["auditID"];

	$table = "dss_answers_manpower";
	$fields = "AMSV, AMPV, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8, row_9, row_10, row_11, row_12, row_13, row_14, row_15, audit_id, total_dealer_score";

	$values = $txtAMPV.",".$txtAMSV.",".$txtRow1.",".$txtRow2.",".$txtRow3.",".$txtRow4.",".$txtRow5.",".$txtRow6.",".$txtRow7.",".$txtRow8.",".$txtRow9.",".$txtRow10.",".$txtRow11.",".$txtRow12.",".$txtRow13.",".$txtRow14.",".$txtRow15.",".$auditID.",".$manpower_dealerScore;


	$answerID = singlefield("answer_id",$table,"audit_id=".$auditID);

	if($answerID){
		$cond = "answer_id=".$answerID;
		$col_val = "AMSV = ".$txtAMPV.", AMPV = ".$txtAMSV.", row_1 = ".$txtRow1.", row_2 = ".$txtRow2.", row_3 = ".$txtRow3.", row_4 = ".$txtRow4.", row_5 = ".$txtRow5.", row_6 = ".$txtRow6.", row_7 = ".$txtRow7.", row_8 = ".$txtRow8.", row_9 = ".$txtRow9.", row_10 = ".$txtRow10.", row_11 = ".$txtRow11.", row_12 = ".$txtRow12.", row_13 = ".$txtRow13.", row_14 = ".$txtRow14.", row_15 = ".$txtRow15.", audit_id = ".$auditID.", total_dealer_score = ".$manpower_dealerScore;
		
		
		if(updaterecs($table,$col_val, $cond)){		
			$arr = array('status' => 1, 'message' => 'Update Success');
		}
		else{
			$arr = array('status' => 0, 'message' => 'Update Failure');
		}

	}
	else{
		if(insertrec($table,$fields,$values)){		
			$arr = array('status' => 1, 'message' => 'Insert Success');
		}
		else{
			$arr = array('status' => 0, 'message' => 'Insert Failure');
		}
	}

	echo json_encode($arr);
}

function getManpower(){
	
	$auditID = $_GET["auditID"];

	$table = "dss_answers_manpower";
	$fields = "AMSV, AMPV, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8, row_9, row_10, row_11, row_12, row_13, row_14, row_15, audit_id, total_dealer_score";

	$dt = singlerec($fields,$table,"audit_id=".$auditID);

	$subStatus = singlefield("man_status","dss_audits","audit_id=".$auditID);

	if($dt){		
		$arr = array('status' => 1, 'subStatus' => $subStatus ,'AMSV' => $dt[0], 'AMPV' => $dt[1], 'row_1' => $dt[2], 'row_2' => $dt[3], 'row_3' => $dt[4], 'row_4' => $dt[5], 'row_5' => $dt[6], 'row_6' => $dt[7], 'row_7' => $dt[8], 'row_8' => $dt[9], 'row_9' => $dt[10], 'row_10' => $dt[11], 'row_11' => $dt[12], 'row_12' => $dt[13], 'row_13' => $dt[14], 'row_14' => $dt[15], 'row_15' => $dt[16], 'audit_id' => $dt[17], 'total_dealer_score' => $dt[18]);
	}
	else{
		$arr = array('status' => 0, 'message' => 'No Record Found');
	}
	echo json_encode($arr);
}

function _getDealers(){

	if(isset($_GET["rsmID"])){
		$userIDs = selectrec("user_id, asm_id","gm_areaservicemanager","zsm_id=".$_GET["rsmID"]);
	}
	else{
		$userIDs = selectrec("user_id, asm_id","gm_areaservicemanager");
	}


	$str = '{ "objects":[';
	$str1 = "";
	foreach ($userIDs as $userID) {


		$rec1 = singlerec("first_name, last_name, email","auth_user","id=".$userID[0]);
		$rec2 = singlerec("phone_number, address","gm_userprofile","user_id=".$userID[0]);

		$str1 .='{

		            "user_id": "'.$userID[0].'",
		            "asm_id": "'.$userID[1].'",
		            "First name": "'.$rec1[0].'",
		            "Last name": "'.$rec1[1].'",
		            "email": "'.$rec1[2].'",
		            "mobile": "'.$rec2[0].'",
		            "address": "'.$rec2[1].'"
				},';

		$str1 .='{

		            "dealer_id": "'.$userID[0].'",
		            "dealer_code": "'.$userID[1].'",
		            "dealer_name": "'.$rec1[0].'",
		            "email": "'.$rec1[1].'",
		            "mobile": "'.$rec2[0].'",
		            "address": "'.$rec2[1].'"
				},';

	}

	if($str1!="")
		$str .= substr($str1,0,-1);

	$str .=']}';

	echo ($str);
}

function getZones(){

	$userIDs = selectrec("user_id, regional_office,id","gm_zonalservicemanager group by regional_office");

	$str = '{"objects":[';
	$str1 = "";
	foreach ($userIDs as $userID) {


		$rec1 = singlerec("first_name, last_name, email","auth_user","id=".$userID[0]);
		$rec2 = singlerec("phone_number, address","gm_userprofile","user_id=".$userID[0]);

		$str1 .='{
					"zone_id":"'.$userID[2].'",
					"zone_name":"'.$userID[1].'",
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

function getAsms(){



	if(isset($_GET["zsm_id"])){
		$userIDs = selectrec("user_id, zsm_id, id, area, asm_id","gm_areaservicemanager","zsm_id='".$_GET["zsm_id"]."'");
	}
	else{
		// echo "1";
		$userIDs = selectrec("user_id, zsm_id, id, area, asm_id","gm_areaservicemanager");
	}



	// $name = "ZonalServiceManagers";

	// $groupID = singlefield("id","auth_group","name='".$name."'");

	// $userIDs = selectrec("user_id","auth_user_groups","group_id=".$groupID);




	$str = '{ "objects":[';
	$str1 = "";
	foreach ($userIDs as $userID) {


		$rec1 = singlerec("first_name, last_name, email","auth_user","id=".$userID[0]);
		$rec2 = singlerec("phone_number, address","gm_userprofile","user_id=".$userID[0]);

		$str1 .='{

		            "id": "'.$userID[2].'",
		            "asm_id": "'.$userID[4].'",
		            "zonal_id": "'.$userID[1].'",
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

function getDealers(){

	if(isset($_GET["asmID"])){
		$userIDs = selectrec("user_id, dealer_id","gm_dealer","asm_id=".$_GET["asmID"]);
	}
	else{
		$userIDs = selectrec("user_id, dealer_id","gm_dealer");
	}


	$str = '{ "objects":[';
	$str1 = "";
	foreach ($userIDs as $userID) {


		$rec1 = singlerec("first_name, email","auth_user","id=".$userID[0]);
		$rec2 = singlerec("phone_number, address","gm_userprofile","user_id=".$userID[0]);

		$str1 .='{

		            "dealer_id": "'.$userID[0].'",
		            "dealer_code": "'.$userID[1].'",
		            "dealer_name": "'.$rec1[0].'",
		            "email": "'.$rec1[1].'",
		            "mobile": "'.$rec2[0].'",
		            "address": "'.$rec2[1].'"
				},';
	}

	if($str1!="")
		$str .= substr($str1,0,-1);

	$str .=']}';

	echo ($str);






	// $fields = "user_id,code,name";
	// $table = "users";
	// $cond = "active=1 and role=3";
	// $rows = selectrec($fields,$table,$cond);
	// $str1 ='{"today_date":"'.date("m.d.y").'","dealers":[';
	// foreach($rows as $row){ 
	// 	$str1 .='{"dealer_id":"'.$row[0].'","dealer_code":"'.$row[1].'","dealer_name":"'.$row[2].'"},';
	// }

	// $str1 = substr($str1,0,-1);


 //    $str1 = $str1."]}";

    // echo $str1;
}
/* ************************** Others ***********************************/
function calcRSOP($audit_id,$pid=6){

	$questionIDS = "";
	$rows1 = selectrec("question_id","dss_questions","process_id =".$pid);
	foreach ($rows1 as $row1) {
		
		$questionIDS .= $row1[0].",";
	}

	$questionIDS = substr($questionIDS,0,-1);

	if($questionIDS!="")
		$tempStr = " and question_id in(".$questionIDS.")";
	else
		$tempStr = "";


	$ds = singlefield("sum(dealer_score)","dss_answers","audit_id=".$audit_id.$tempStr);

	$fields = "sub_heading_id,sub_heading_name";
	$table = "dss_sub_heading";
	$cond = "active=1 and process_id=".$pid;
	$countRows = selectrec($fields,$table,$cond);

	
	$savedCount = 0;
	foreach($countRows as $countRow){
		if(in_array($countRow[0],getHeaderIDs($audit_id,$pid))){
			$savedCount++;
		}
	}

	if($savedCount>1)
		$ds = $ds/$savedCount;
	else
		$ds = 0;

	// $dealer_score1 += -$ds;

	return $ds;
}

function fetchAuditData($fields,$table,$cond,$txtDealer,$audit_id){

	$rows = selectrec($fields,$table,$cond);
	$arr= "";

	global $finalTotal;
	global $max_score;

	foreach ($rows as $row) {

		// if($row[0]==1){

			$totalData = calculateTotal($audit_id,$row[0]);

			// $totalValues = array("totalScore" => $total_score, "dealerScore"=>$dealer_score, "adherence" => $adherence, "subStat" => $subStat, "max_score" => $max_score, "subCategory" => $subCategory);

			$dealer_score 	= $totalData["dealerScore"];
			$adherence 		= $totalData["adherence"];
			$subStat 		= $totalData["subStat"];
			$max_score_1	= $totalData["max_score"];
			$subCategory 	= $totalData["subCategory"];

			$finalTotal 	+= $dealer_score;
			$max_score 		+= $max_score_1;
			
			$canSubmit		= 0;
			$submit_status_count = singlefield("count(id)","dss_submit_status","dss_id=".$row[0]." and audit_id=".$audit_id);
			
			if($row[0]==1 || $row[0]==4){
				
				$table_record_count = singlefield("count(process_id)","dss_process","dss_id=".$row[0]);
				if($submit_status_count==$table_record_count)
					$canSubmit = 1;
			}
			else if($row[0]==2){

				$table_record_count = singlefield("count(answer_id)","dss_answers_manpower","audit_id=".$audit_id);
				if($table_record_count)
					$canSubmit = 1;
			}
			else if($row[0]==3){

				$subHeaderIDs = selectrec("dss_sub_id","dss_sub_categories","dss_id=".$row[0]);
				$table_record_count = 0;

				foreach ($subHeaderIDs as $subHeaderID) {
					$table_record_count += singlefield("count(sc_header_id)","dss_sub_category_headers","dss_sub_id=".$subHeaderID[0]);			
				}

				if($submit_status_count==$table_record_count)
					$canSubmit = 1;
			}


			$arr .= '{
				"type_name": "'.$row[1].'",
				"type_id": "'.$row[0].'",
				"hasSubCategory": "'.$subCategory.'",
				"img_src": "img_url",
				"icon_name": "'.$row[2].'",
				"submitted_status":"'.$subStat.'",
				"canSubmit":"'.$canSubmit.'",
				"more_info": "audit-questionnaire.html?id='.$row[0].'",
				"legends": [
				
				{
					"type": "Weightage",
					"score": "'.round($max_score_1,2).'"
				},
				{
					"type": "Total Score",
					"score": "'.round($dealer_score,2).'"
				},
				{
					"type": "Adherence",
					"score": "'.$adherence.'"
				}
				]
			},';

		// }
	}

	$arr = substr($arr,0,-1);
	return $arr;
}

function getSummage($pid,$audit_id){

	$dealer_score1 =0;
	// ***************************************************************************************************************************8
	if($pid == 5 || $pid == 13){

		$modelIDs = selectrec("model_id","dss_questions","active=1 and process_id=".$pid." group by model_id");

		$str1 ='';
		$savedCount = 0;
		foreach($modelIDs as $modelID){
			//echo "YES ".$modelID[0]."<br/>";

			$fields = "model_id,model_name";
			$table = "vehicle_models";
			$cond = "active=1 and model_id=".$modelID[0];
			$rows = singlerec($fields,$table,$cond);

			if(in_array($rows[0],getModelIDs($audit_id,$pid))){
				$savedCount++;
			}
		}

				// echo $dealer_score1."................1<br/><br/>";

	}


	// ***************************************************************************************************************************8
	if($pid == 6){
		
		$headingIDs = selectrec("sub_heading_id","dss_questions","active=1 and process_id=".$pid." group by sub_heading_id");

		$str1 ='';
		$savedCount = 0;
		foreach($headingIDs as $headingID){
			// echo "YES ".$headingID[0]."<br/>";

			$fields = "sub_heading_id,sub_heading_name";
			$table = "dss_sub_heading";
			$cond = "active=1 and sub_heading_id=".$headingID[0];
			$rows = singlerec($fields,$table,$cond);

			// print_r($rows[0]);
			// echo"<br>";

			if(in_array($rows[0],getHeaderIDs($audit_id,$pid))){
				$savedCount++;
			}
		}

	}


	if($savedCount>1)
		$dealer_score1 += getanswerSum($pid,$audit_id);


	return $dealer_score1;

	// ***************************************************************************************************************************8
}

function getanswerSumHeaders($pid,$audit_id){

	$headingIDs = selectrec("sub_heading_id","dss_questions","active=1 and process_id=".$pid." group by sub_heading_id");

	$str1 ='';
	$savedCount = 0;
	foreach($headingIDs as $headingID){
		//echo "YES ".$modelID[0]."<br/>";

		$fields = "sub_heading_id,sub_heading_name";
		$table = "dss_sub_heading";
		$cond = "active=1 and sub_heading_id=".$headingID[0];
		$rows = singlerec($fields,$table,$cond);

		//print_r($rows[0]);
		//echo"<br>";

		if(in_array($rows[0],getHeaderIDs($audit_id,$pid))){
			$savedCount++;
		}
	}

	$questionIDS = "";
	$rows1 = selectrec("question_id","dss_questions","process_id =".$pid);
	foreach ($rows1 as $row1) {

		$questionIDS .= $row1[0].",";
	}
	$questionIDS = substr($questionIDS,0,-1);

	//echo $questionIDS;

	$dealer_score = singlefield("sum(dealer_score)","dss_answers","question_id in(".$questionIDS.") and active=1 and audit_id=".$audit_id);

	if($savedCount==0)
		$savedCount = 1;

	$dealer_score = $dealer_score/$savedCount;

	return $dealer_score;
}

function getanswerSum($pid,$audit_id){
	$modelIDs = selectrec("model_id","dss_questions","active=1 and process_id=".$pid." group by model_id");

	$str1 ='';
	$savedCount = 0;
	foreach($modelIDs as $modelID){
		//echo "YES ".$modelID[0]."<br/>";

		$fields = "model_id,model_name";
		$table = "vehicle_models";
		$cond = "active=1 and model_id=".$modelID[0];
		$rows = singlerec($fields,$table,$cond);

		if(in_array($rows[0],getModelIDs($audit_id,$pid))){
			$savedCount++;
		}
	}

	$questionIDS = "";
	//echo $pid."<br/>";
	$rows1 = selectrec("question_id","dss_questions","process_id =".$pid);
	foreach ($rows1 as $row1) {

		$questionIDS .= $row1[0].",";
	}
	$questionIDS = substr($questionIDS,0,-1);


	$relCount = selectrec("relCount","dss_answers","question_id in(".$questionIDS.") and active=1 and audit_id=".$audit_id." group by relCount");



	$dealer_score = singlefield("sum(dealer_score)","dss_answers","question_id in(".$questionIDS.") and active=1 and audit_id=".$audit_id);


	// $dealer_score = $dealer_score/count($relCount;



	if($savedCount==0)
		$savedCount = 1;

	//echo $dealer_score/$savedCount."<br/>";


	$dealer_score = $dealer_score/$savedCount;

	return $dealer_score;
}

function default_headers($default_type){
	$default_desc = singlefield("default_desc","dss_defaults","default_type='".$default_type."'");
	$str = '"'.$default_type.'": "'.$default_desc.'"';
	return $str;
}

function rand_passwd( $length = 8, $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' ) {
    return substr( str_shuffle( $chars ), 0, $length );
}

function fPassword(){
	$txtEmail = $_POST["txtEmail"];
	$userid = (singlefield("id","auth_user","email = '".$txtEmail."'"));

	if($userid){
		passwordResetByEmail($userid);
		$arr = array('status' => 1, 'message' => 'Success');
	}
	else{
		$arr = array('status' => 0, 'message' => 'Reset Failure. Please try again');
	}
	echo json_encode($arr);
}

function passwordResetByEmail($userid){

 	$table = "auth_user";
 	$cond = "ID=".$userid;
	$newPassword = rand_passwd();
	$fieldname	= "password";
	$newval = "'".md5($newPassword)."'";

	if(updaterec($table,$fieldname,$newval,$cond)){

	 	$fields = "username,name,email";
		$rows = singlerec($fields,$table,$cond);
		$row = mysql_fetch_row($rows);

	    $message = "Your password reset link send to your e-mail address.";
	    $to=$row[2];
	    $subject="Bajaj Admin - Password reset";
	    $from = "noreply@bajajauto.co.in";
	    $rPass = md5(time());

        $body='<span style="font-family:arial,verdana">Hi '.$row[1].', <br/> <br/>Your Username is: '.$row[0].' <br><br>Your password has been reset to: <b>'.$newPassword."</b></span><br/><br/>Regards,<br/>Total Admin.";

	    $headers = "From: " . strip_tags($from) . "\r\n";
	    $headers .= "Reply-To: ". strip_tags($from) . "\r\n";
	    $headers .= "MIME-Version: 1.0\r\n";
	    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

		//echo $body;
     	if(mail($to,$subject,$body,$headers))
     		$arr = array('status' => 1, 'message' => 'Password Reset Successful.'.$to);
     	else
     		$arr = array('status' => 0, 'message' => 'Password Reset Un-Successful.');

		echo json_encode($arr);

	}
}

function mailTo($subject,$to,$body,$cc){

	$from_email = "noreply@bajajauto.co.in";

	$headers = "From: " . strip_tags($from_email) . "\r\n";
	$headers .= "Reply-To: ". strip_tags($from_email) . "\r\n";
	$headers .= 'Cc: '.$cc. "\r\n";
	$headers .= 'BCC: '."karthik.rajagopalan@gladminds.co, naveen.shankar@gladminds.co, ashakiran@gladminds.co". "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

	// echo $body;

	mail($to,$subject,$body,$headers);
}

function insertManPower(){
	$txt_AMSV = $_POST["txt_AMSV"]; 
	$txt_AMPV = $_POST["txt_AMPV"]; 
	$txt_rows = $_POST["txt_row"]; 

	$audit_id = $_POST["auditID"];
}

function getreportAPI(){

	$dealerID= $_GET['dealer'];
	if(isset($_GET['from_date']))
		$from_date 	= $_GET['from_date'];
	else
		$from_date = "";

	if(isset($_GET['to_date']))
		$to_date 	= $_GET['to_date'];
	else
		$to_date = "";

	// " and stat_timestamp>='".$from_date."' and stat_timestamp<='".$to_date."'"
	$cond="";

	if($from_date!="")
		$cond =" and stat_timestamp>='".$from_date."'";

	if($to_date!="")
		$cond .=" and stat_timestamp<='".$to_date." 23:59:59.999'";

	$str1 ='{
				"audit_sections":[';

	$rows = selectrec("dss_id, dss_name, unique_id", "dss_dssids");

	$str2 = "";
	foreach ($rows as $row) {

		$str2 .= '{
					"key":"'.$row[2].'",
					"process_name":"'.$row[1].'",
					"details": [
					';

		$rows1 = selectrec("process_id, process_name","dss_process","active=1 and dss_id=".$row[0]);
		
		$str3 = "";
		// $processIDArray[] = "";
		foreach ($rows1 as $row1) {

			//Choose only the Process Block
			if($row[0]==1){
				$str3 .= '"'.$row1[1].'",';
				$processIDArray[] =  $row1[0];
			}
		}


		
		 $str2 .= substr($str3,0,-1);


		$str2 .= ']},';

	}
	// $processIDArray = implode (", ", $processIDArray);
	$wt_process = 500;
	$wt_manpower = 250;
	$wt_tools	= 150;
	$wt_infra   = 100;



	$str1 .= substr($str2,0,-1);

	$str1 .= '], "audit_data":[';


	$arows = selectrec("audit_id, auditor_id, stat_timestamp", "dss_audits", "status=1 and dealer_id=".$dealerID.$cond);

	$str2 = "";

	foreach ($arows as $arow) {
		$auditID = $arow[0];
		$audited_by = singlefield("first_name","auth_user","id=".$arow[1]);
		$last_name = singlefield("last_name","auth_user","id=".$arow[1]);

		if($last_name!="")
			$audited_by .= " ".$last_name;


		$str2 .= '{
			"audited_by":"'.$audited_by.'",
			"audited_date":"'.date("M Y", strtotime($arow[2])).'",
			"process_details":[';


    $rows = selectrec("process_id,process_name","dss_process","active=1 and dss_id=1");
    $strProcessAdherance = "";
    $dealerScores = 0;
    $total_scores = 0;

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


		if($row[0]==12){
			$total_score = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$row[0]);
			$dealer_score = singlefield("sum(dealer_score)","dss_answers_customers","audit_id=".$arow[0].$tempStr);
			$qCount = singlefield("count(answer_id)","dss_answers_customers","audit_id=".$arow[0]." and cust_name!=''");

			$total_score = $total_score/5;

			$total_score1 = ($total_score==0)?1:$total_score;



			// if($submitted=="1"){
				$dealer_score = singlefield("sum(dealer_score)","dss_answers_customers","audit_id=".$arow[0].$tempStr);

				$savedCount_1 = singlefield("count(answer_id)","dss_answers_customers","audit_id=".$arow[0]." and cust_name!=''");

				if($savedCount_1>0)
					$dealer_score = $dealer_score/$savedCount_1;
			// }


			if($qCount==0)
				$adherence = 0;
			else
				$adherence = ($dealer_score/$total_score)*100;	
		}

		else if($row[0]==6){
			// $total_score = "70";
			$total_score = calculateTotalScore($row[0]);
			$savedCount_1 = $dealer_score = 0;

			$qIDList = getQuestionIDsByProcessID($row[0]);

			$tempStr1 = " and question_id in (".$qIDList.")";
			$relCounts = selectrec("relCount","dss_answers","audit_id=".$auditID.$tempStr1." group by relCount");

			foreach($relCounts as $relCount){ 

				$dealer_score += singlefield("sum(dealer_score)","dss_answers","audit_id=".$auditID.$tempStr1." and relCount=".$relCount[0]);
				$savedCount_1 += count(getHeaderIDs($auditID,$row[0],$relCount[0]));

			}

			// echo $savedCount_1;

			
			$total_score1 = ($total_score==0)?1:$total_score;

			if($savedCount_1>1)
				$dealer_score = $dealer_score/$savedCount_1;

			if($dealer_score>0)
				$adherence = ($dealer_score/$total_score1)*100;	
			else
				$adherence = "";

		}

		else if($row[0]==13 || $row[0]==5){

			// if($row[0]==13)
			// 	$total_score = "40";
			// else
			// 	$total_score = "100";

			$total_score = calculateTotalScore($row[0]);

			$savedCount_1 = 0;

			$qIDList = getQuestionIDsByProcessID($row[0]);

			$tempStr1 = " and question_id in (".$qIDList.")";
			$relCounts = selectrec("relCount","dss_answers","audit_id=".$auditID.$tempStr1." group by relCount");

			$dealer_score = 0;

			foreach($relCounts as $relCount){ 

				$dealer_score += singlefield("sum(dealer_score)","dss_answers","audit_id=".$auditID.$tempStr1." and relCount=".$relCount[0]);
				$savedCount_1 += count(getModelIDs($auditID,$row[0],$relCount[0]));

			}
			
			$total_score1 = ($total_score==0)?1:$total_score;

			if($savedCount_1>1)
				$dealer_score = $dealer_score/$savedCount_1;

			if($dealer_score>0)
				$adherence = ($dealer_score/$total_score1)*100;	
			else
				$adherence = "";

		}
		else{
			$total_score = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$row[0]);
			$dealer_score = singlefield("sum(dealer_score)","dss_answers","audit_id=".$arow[0].$tempStr);

			$total_score1 = ($total_score==0)?1:$total_score;

			$adherence = ($dealer_score/$total_score1)*100;	
		}
		
		// $hasTxt = singlefield("has_text","dss_questions","process_id =".$row[0]);

		// $str .= '{
	 //        "adherence": "'.round($adherence,2).'%",
	 //        "has_text": "'.$hasTxt.'"';


		$strProcessAdherance .='"'.round($adherence,2).'",';
		$dealerScores += round($dealer_score,2);
		$total_scores +=round($total_score,2);
    }


    	$str2 .= substr($strProcessAdherance,0,-1);
    	// $dealerScores = substr($dealerScores,0,-1);
    	$dealerScoreAdherance = ($dealerScores/$total_scores)*100;



    	//For getting all the question IDs where process ID=4 (CI Element)
    	
    	$questionIDS = "";


    	$rows1 = selectrec("process_id","dss_process","dss_id =4");
		foreach ($rows1 as $row1) {

			$rows2 = selectrec("question_id","dss_questions","process_id =".$row1[0]);
			// echo "select question_id from dss_questions where process_id=".$row1[0]."                 ";
			foreach ($rows2 as $row2) {
				
				
				$questionIDS .= $row2[0]." ,";
			}
			// echo $questionIDS."<br/>";
		}

		$questionIDS = substr($questionIDS,0,-1);

		// echo $questionIDS;
		$process_total = $dealerScores;
		$manpower_total = singlefield("total_dealer_score","dss_answers_manpower","audit_id=".$arow[0]);
		$tools_total = singlefield("sum(dealer_score)","dss_answers_sub_category","audit_id=".$arow[0]);
		$ci_total = singlefield("sum(dealer_score)","dss_answers","audit_id=".$arow[0]." and question_id in(".$questionIDS.")");

		$g_total = ($process_total+$manpower_total+$tools_total+$ci_total);



		$str2 .= '],
			"dealer_score_details":['. $dealerScoreAdherance .'],
			"manpower_details":["'. round(($manpower_total / $wt_manpower)*100,2) .'"],
			"tools_details":["'. round(($tools_total / $wt_tools)*100,2) .'"],
			"i_ci_details":["'. round(($ci_total / 100)*100,2) .'"],
			"grand_total_details":["'. round(($g_total / getMaxTotal($arow[0]))*100,2) .'"] 
		},';

		// echo "select sum(dealer_score) from dss_answers where audit_id=".$arow[0]." and question_id in(".$questionIDS.")";
	}
	$str1 .= substr($str2,0,-1);

				// ],
				// "audit_data":[';

					// {
					// 	"audited_by":"Akshay",
					// 	"audited_date":"11th Jan 2015",
					// 	"process_details":["20","90","90","90","90","90","90","90","90","90","90","90","90"],
					// 	"manpower_details":["20"],
					// 	"tools_details":["20"],
					// 	"i_ci_details":["20"]
					// },

			$str1 .=	']
			}';

	echo $str1;
	// print_r($processIDArray);
}

function fetchAuditDataPageEmail($audit_id){
	global $finalTotal;
	global $max_score;

	
	$txtDealer = singlefield("dealer_id","dss_audits","audit_id=".$audit_id);
	$txtAuditDate = singlefield("datetime","dss_audits","audit_id=".$audit_id);
	

	// $max_score = "1000";//singlefield("sum(max_score)","dss_questions");

	$dealer_score = singlefield("sum(dealer_score)","dss_answers","audit_id=".$audit_id);
	$dealer_score = $dealer_score + singlefield("sum(dealer_score)","dss_answers_sub_category","audit_id=".$audit_id);
	$dealer_score = $dealer_score + singlefield("total_dealer_score","dss_answers_manpower","audit_id=".$audit_id);
	
	$fields = "dss_id,dss_name,icon";
	$table = "dss_dssids";
	$cond = "active=1";

	$arr1 =fetchAuditDataEmail($fields,$table,$cond,$txtDealer,$audit_id);	
	$dealer_code = singlefield("dealer_id","gm_dealer","user_id=".$txtDealer);
	$adherence = ($dealer_score>=1)?(round(($finalTotal/$max_score)*100,2))."%":"";

	$txtAuditDate = date("F d Y", strtotime($txtAuditDate));

	$str ='<table style="width: 100%; margin-top: 23px; border: 1px solid rgb(238, 238, 238); color: rgb(51, 51, 51); font-family: sans-serif;">
			
			<!-- First Row -->
			<tr>
				<td colspan="4" style="padding: 16px 0px;" align="center">
					<table  style="font-size:12px;width: 50%; margin-left: auto; margin-right: auto; text-align: center; border: 1px solid rgb(153, 153, 153); box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);">
						<thead>
							<tr>
								<th colspan="2" style="color: rgb(255, 255, 255); padding: 7px; background: rgb(27, 148, 195) none repeat scroll 0px 0px;">Dealer Name: '.singlefield("first_name","auth_user","id=".$txtDealer).'</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="padding: 10px; line-height: 30px;text-align:left;">
									<strong>Dealer Code</strong>: '.$dealer_code.'<br/>
									<strong>Date</strong>: '.$txtAuditDate.'
								</td>
								<td style="padding: 10px; line-height: 30px;text-align:left;">

									<strong>Weightage</strong>: '.round($max_score,2).' <br/>
									<strong>Total Score</strong>: '.round($finalTotal,2).' <br/>
									<strong>Adherence</strong>: '.$adherence.'

								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>

			<!-- Second Row -->
			<tr>';
				
		$str .= $arr1;


		$str .='</tr>

		</table>';


	return $str;
}

function fetchAuditDataEmail($fields,$table,$cond,$txtDealer,$audit_id){

	$rows = selectrec($fields,$table,$cond);
	$arr= "";
	$str1 = "";

	$arrColor = array("#2980B9","#E74C3C","#8E44AD","#16A085");

	$count = 0;

	foreach ($rows as $row) {


		$rows = selectrec($fields,$table,$cond);
		$arr= "";

		global $finalTotal;
		global $max_score;

	
		$totalData = calculateTotal($audit_id,$row[0]);

		$dealer_score 	= $totalData["dealerScore"];
		$adherence 		= $totalData["adherence"];
		$subStat 		= $totalData["subStat"];
		$max_score_1	= $totalData["max_score"];
		$subCategory 	= $totalData["subCategory"];

		$finalTotal 	+= $dealer_score;
		$max_score 		+= $max_score_1;

		$str1 .='<td cellspace="30%" style="width: 25%; padding: 8px; border-top: 1px solid rgb(238, 238, 238); border-right: 1px solid rgb(238, 238, 238); text-align: center;">
					<table style="background: '.$arrColor[$count].' none repeat scroll 0px 0px; color: rgb(239, 239, 239);" width="100%">
						<tr>
							<td align="center" style="font-size:12px;">
								<h3 style="font-size:15px;">'.$row[1].'</h3>
								<p>Weightage : '.round($max_score_1,2).'</p>
								<p>Total Score : '.round($dealer_score,2).'</p>
								<p>Adherence : '.$adherence.'</p>
							</td>
						</tr>
					</table>
				</td>';

		$count++;

	}

	$arr = substr($arr,0,-1);
	return $str1;
}

// function showZerosEmail($audit_id){
function showZerosEmail($audit_id){

	// $audit_id = $_GET['audit_id'];

	$str='<table border="1" cellpadding="2" cellspacing="3" style="border-collapse: collapse; font-family: Arial; font-size: 12px" bordercolor="#111111" width="100%">
	  <tr>
	    <td width="10%" align="center" bgcolor="#1C92C5" bordercolor="#FFFFFF" align="center" colspan="2">
	    <font color="#FFFFFF"><b>Main Parameter</b></font></td>
	    <td width="38%" align="center" bgcolor="#1C92C5" bordercolor="#FFFFFF">
	    <font color="#FFFFFF"><b>Sum Parameter</b></font></td>
	    <td width="74" align="center" bgcolor="#1C92C5" bordercolor="#FFFFFF">
	    <font color="#FFFFFF"><b>Max Score</b></font></td>
	    <td width="89" align="center" bgcolor="#1C92C5" bordercolor="#FFFFFF">
	    <font color="#FFFFFF"><b>Dealer Score</b></font></td>
	    <td width="46%" align="center" bgcolor="#1C92C5" bordercolor="#FFFFFF">
	    <font color="#FFFFFF"><b>ASM Remarks</b></font></td>
	  </tr>';

	 // $qIds = getQuestionIDs(1);

	  $processIDs = selectrec("dss_id, dss_name","dss_dssids");

	  foreach ($processIDs as $processID) {

	  		if($processID[0]=="2"){
	  			//For Manpower
	  			$row = selectrec("question_name, max_score","dss_questions","process_id=17");
	  			$str1 = $rowCount = "";
	  			for($i=1;$i<=15;$i++){
	  				${'col'.$i} = singlefield("answer_id","dss_answers_manpower","audit_id=".$audit_id." and row_".$i."=0");

	  				if(${'col'.$i}){

						$rowCount++;
						$count++;
						$str1 .='<tr>
								    <td width="38%">'.$count.". ".$row[$i][0].'</td>
								    <td width="74" align="center">'.$row[$i][1].'</td>
								    <td width="89" align="center">0</td>
								    <td width="46%">-</td>
						  		</tr>';
	  				}

	  			}
	  		}
	  		else if($processID[0]=="3"){
	  			//For Tools and Equipments
	  			$str1 = $rowCount = "";
	  			$subCategories = selectrec("dss_sub_id, dss_sub_name","dss_sub_categories","active=1");

		  		$str1 = $str2 = "";
		  		$rowCount = $irowCount = 0;

	  			foreach ($subCategories as $subCategory) {
					$accordions = selectrec("sc_header_id, sc_header_name","dss_sub_category_headers","dss_sub_id=".$subCategory[0]);


					foreach ($accordions as $accordion) {

						$questionIDs = singlerec("GROUP_CONCAT(sc_question_id)","dss_sub_category_question","sc_header_id=".$accordion[0]);

						// echo $questionIDs[0]."<br><br/>";

						if($questionIDs[0]!="")
							$qStr = " and question_id in(".$questionIDs[0].")";

						$tableName = "dss_answers_sub_category";

						$answers = selectrec("question_id, dealer_score, audit_remarks",$tableName,"audit_id=".$audit_id." and dealer_score=0 ".$qStr);

						$count=0;

						if(count($answers)>0){
							$rowCount++;
							$irowCount++;
							$str2 .='<tr>
									    <td bgcolor="#C5D9F1" colspan=4><strong>'.$accordion[1].'</strong></td>
							  		</tr>';
						}

						// echo $accordion[1];
						
						foreach ($answers as $answer) {
							$rowCount++;
							$irowCount++;
							$count++;

							$str2 .='<tr>
									    <td width="38%">'.$count.". ".singlefield("sc_question_name","dss_sub_category_question","sc_question_id=".$answer[0]).'</td>
									    <td width="74" align="center">'.singlefield("sc_question_marks","dss_sub_category_question","sc_question_id=".$answer[0]).'</td>
									    <td width="89" align="center">'.$answer[1].'</td>
									    <td width="46%">'.$answer[2].'</td>
							  		</tr>';


						}
					}


					if(count($accordions)>0){
						if($str2!="")
						$rowCount++;
						$str1 .='<tr><td bgcolor="#F7DA84" rowspan="'.++$irowCount.'"><strong>'.$subCategory[1].'</strong></td></tr>'.$str2;
						$str2 = "";
						$irowCount = 0;
					}

	  			}
	  		}
	  		else{

		  		$accordions = selectrec("process_id, process_name","dss_process","dss_id=".$processID[0]);


		  		$str1 = "";
		  		$rowCount = 0;

				foreach ($accordions as $accordion) {


					$questionIDs = singlerec("GROUP_CONCAT(question_id)","dss_questions","process_id=".$accordion[0]);

					// echo $questionIDs[0]."<br><br/>";

					if($questionIDs[0]!="")
						$qStr = " and question_id in(".$questionIDs[0].")";


					if($accordion[0]=="12" && $processID[0]=="1"){
						$tableName = "dss_answers_customers";
						// echo $qStr;
					}
					else
						$tableName = "dss_answers";



					$answers = selectrec("question_id, dealer_score, audit_remarks",$tableName,"audit_id=".$audit_id." and dealer_score=0 ".$qStr);

					$count=0;

					if(count($answers)>0){
						$rowCount++;
						$str1 .='<tr>
								    <td bgcolor="#C5D9F1" colspan=4><strong>'.$accordion[1].'</strong></td>
						  		</tr>';
					}
					foreach ($answers as $answer) {
						$rowCount++;
						$count++;
						$str1 .='<tr>
							    <td width="38%">'.$count.". ".singlefield("question_name","dss_questions","question_id=".$answer[0]).'</td>
							    <td width="74" align="center">'.singlefield("max_score","dss_questions","question_id=".$answer[0]).'</td>
							    <td width="89" align="center">'.$answer[1].'</td>
							    <td width="46%">'.$answer[2].'</td>
					  		</tr>';


					}


				}
			}

			//Show only if the records exists.
			if($rowCount>0){
				
				if($processID[0]=="3"){
					// echo $rowCount;
					$str .="<tr><td rowspan='".++$rowCount."' align='center'><h4>".$processID[1]."</h4></td></tr>";
				}
				else{
					$str .="<tr><td rowspan='".++$rowCount."' align='center' colspan='2'><h4>".$processID[1]."</h4></td></tr>";

				}
					$str.=$str1;
					$str .="<tr><td colspan='6' align='center' bgcolor='#cdcdcd' style='height:5px;'></td></tr>";

			}
			else{
				$str .="<tr><td colspan='6' align='left' valign='middle'><h4 style='margin:5px;'>".$processID[1]."</h4> (No Zero Parameters)</td></tr>";
			}

	  }



	$str .='</table>';

	return $str;
	// echo $str;
}

function getQuestionIDs($pid){

	$processIDs = selectrec("process_id","dss_process","dss_id=".$pid);

		$qid = "";
	 	foreach ($processIDs as $processID) {
	 		
	 		$questionIDs = selectrec("question_id","dss_questions","process_id=".$processID[0]);

	 		foreach ($questionIDs as $questionID) {
	 			$qid .=$questionID[0].",";
	 		}

	 		$questionIDs = selectrec("question_id","dss_questions_repair_sop","process_id=".$processID[0]);

	 		foreach ($questionIDs as $questionID) {
	 			$qid .=$questionID[0].",";
	 		}
			
	 	}
		$qid = substr($qid,0,-1);

		return $qid;
}

function deleteAudit(){
	$auditID = $_GET["auditID"];

	$userID = $_SESSION['USER_ID'];

	if(singlefield("auditor_id","dss_audits","audit_id=".$auditID)==$userID){

		if(deleterec("dss_audits","audit_id",$auditID,$type="delete") && deleterec("dss_answers","audit_id",$auditID,$type="delete") && deleterec("dss_answers_customers","audit_id",$auditID,$type="delete") && deleterec("dss_answers_manpower","audit_id",$auditID,$type="delete") && deleterec("dss_answers_sub_category","audit_id",$auditID,$type="delete") && deleterec("dss_answers_technician_details","audit_id",$auditID,$type="delete")){
			$arr = array('status' => 1, 'message' => 'Record Delete Successful');
		}
		else{
			$arr = array('status' => 0, 'message' => 'Record Delete Un-Successful. Please Try again');
		}

		echo json_encode($arr);
	}
}







function commaSeperated($field,$table,$cond){

	$records = selectrec($field,$table,$cond);
	
	$vals = "";
	foreach ($records as $record) {
		$vals .= $record[0].",";
	}
	
	$vals = rtrim($vals, ',');

	return $vals;
}

?>