<?php

//Accordions and Questions
function calAverage($auditID, $processID){
	
	$questionIDS = singlefield("GROUP_CONCAT(question_id)","dss_questions","process_id =".$processID);

	if($questionIDS!="")
		$tempStr = " and question_id in(".$questionIDS.")";
	else
		$tempStr = "";

	// echo $tempStr."<br/>";

	if($processID==12){
		$total_score = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$processID);
		$dealer_score = singlefield("sum(dealer_score)","dss_answers_customers","audit_id=".$auditID.$tempStr);
		$qCount = singlefield("count(answer_id)","dss_answers_customers","audit_id=".$auditID." and cust_name!=''");

		$total_score = $total_score/5;

		$total_score1 = ($total_score==0)?1:$total_score;



		// if($submitted=="1"){
			$dealer_score = singlefield("sum(dealer_score)","dss_answers_customers","audit_id=".$auditID.$tempStr);

			$savedCount_1 = singlefield("count(answer_id)","dss_answers_customers","audit_id=".$auditID." and cust_name!=''");

			if($savedCount_1>1)
				$dealer_score = $dealer_score/$savedCount_1;
		// }


		if($qCount==0)
			$adherence = 0;
		else
			$adherence = ($dealer_score/$total_score)*100;	
	}

	else if($processID==6){
		$total_score = calculateTotalScore(6);;
		$savedCount_1 = $dealer_score = 0;

		$qIDList = getQuestionIDsByProcessID($processID);

		$tempStr1 = " and question_id in (".$qIDList.")";
		$relCounts = selectrec("relCount","dss_answers","audit_id=".$auditID.$tempStr1." group by relCount");

		foreach($relCounts as $relCount){ 

			$dealer_score += singlefield("sum(dealer_score)","dss_answers","audit_id=".$auditID.$tempStr1." and relCount=".$relCount[0]);
			$savedCount_1 += count(getHeaderIDs($auditID,$processID,$relCount[0]));

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

	else if($processID==13 || $processID==5){

		// if($processID==13)
		// 	$total_score = "40";
		// else
		// 	$total_score = "100";

		$total_score = calculateTotalScore($processID);

		$savedCount_1 = 0;

		$qIDList = getQuestionIDsByProcessID($processID);

		$tempStr1 = " and question_id in (".$qIDList.")";
		$relCounts = selectrec("relCount","dss_answers","audit_id=".$auditID.$tempStr1." group by relCount");

		$dealer_score = 0;

		foreach($relCounts as $relCount){ 

			$dealer_score += singlefield("sum(dealer_score)","dss_answers","audit_id=".$auditID.$tempStr1." and relCount=".$relCount[0]);
			$savedCount_1 += count(getModelIDs($auditID,$processID,$relCount[0]));

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
		$total_score = singlefield("sum(max_score)","dss_questions","active=1 and process_id =".$processID);
		$dealer_score = singlefield("sum(dealer_score)","dss_answers","audit_id=".$auditID.$tempStr);

		$total_score1 = ($total_score==0)?1:$total_score;

		$adherence = ($dealer_score/$total_score1)*100;	
	}

	$totalValues = array("totalScore" => $total_score, "dealerScore"=>$dealer_score, "adherence" => $adherence);

	return $totalValues;
}

//Main Dashboard Total Calculations
function calculateTotal($audit_id, $processID){

	$total_score = $dealer_score = 0;

	if($processID == 1 || $processID == 4){	
		$aprocessIDs = selectrec("process_id","dss_process","dss_id=".$processID);

		foreach ($aprocessIDs as $aprocessID) {
			
			$totalValues 	= calAverage($audit_id, $aprocessID[0]);
			$total_score 	+= $totalValues["totalScore"];
			$dealer_score 	+= $totalValues["dealerScore"];
			
		}
	}
	else if($processID == 2)
		$dealer_score = singlefield("total_dealer_score","dss_answers_manpower","audit_id=".$audit_id);

	else if($processID == 3)
		$dealer_score = singlefield("sum(dealer_score)","dss_answers_sub_category","audit_id=".$audit_id);



	// echo $total_score;

	if($processID==1){
		$max_score = $total_score;
		$col = "pro_status";
	}
	else if($processID==2){
		$max_score = 250;
		$col = "man_status";
	}
	else if($processID==3){
		$max_score = singlefield("sum(sc_question_marks)","dss_sub_category_question");
		$col = "too_status";
	}
	else if($processID==4){
		$max_score = $total_score;
		$col = "inf_status";
	}


	$adherence = ($dealer_score/$max_score)*100;	

	$subStat = singlefield($col,"dss_audits","audit_id=".$audit_id);  
	if($subStat==2)
		$subStat = 0;

	// $subStat = 0;


	//Check if a main Ribbon has Sub Categories or not. This is currently only for Tools and Equipment
	$subCategory = singlefield("count(dss_sub_id)","dss_sub_categories","dss_id=".$processID);

	if($subCategory==0)
		$subCategory = 0;
	else
		$subCategory = 1;



	$totalValues = array("dealerScore"=>round($dealer_score,2), "adherence" => round($adherence,2)."%", "subStat" => $subStat, "max_score" => round($max_score,2), "subCategory" => $subCategory);

	return $totalValues;
}


//Main Dashboard Total Calculations
function calculateWeightage($audit_id=0){
	$max_score = 0;
	$arrTotal = array();

	$processIDs = selectrec("dss_id","dss_dssids");

	foreach($processIDs as $dssID){
		// echo $dssID[0];

		if($dssID[0] == 1 || $dssID[0] == 4){	
			$aprocessIDs = selectrec("process_id","dss_process","dss_id=".$dssID[0]);

			foreach ($aprocessIDs as $aprocessID) {
				// echo $aprocessID[0];

				$totalValues 	= calAverage(0, $aprocessID[0]);
				$max_score 		+= $totalValues["totalScore"];
			}
		}
		else if($dssID[0]==2){
			$max_score = 250;
		}
		else if($dssID[0]==3){
			$max_score = singlefield("sum(sc_question_marks)","dss_sub_category_question");
		}

		$arrTotal[] = round($max_score,2);
	}

	return $arrTotal;
}


function calculateTotalScore($processID){
	//This function calculates the sum of the accordions 5,6 and 13
	if($processID == 5 || $processID == 13)
		$fieldToCheck = "model_id";
	else
		$fieldToCheck = "sub_heading_id";
	
	$rows = selectrec($fieldToCheck,"dss_questions","process_id=".$processID." group by ".$fieldToCheck." and active=1");
	$max_score = 0;

	foreach ($rows as $row) {
		$max_score += singlefield("sum(max_score)","dss_questions",$fieldToCheck."=".$row[0]." and process_id=".$processID." and active=1");
	}

	return $max_score/count($rows);

}


function getQuestionIDsByProcessID($pid){

	// $questionIDS = singlefield("GROUP_CONCAT(question_id)","dss_questions","process_id =".$pid);

	$questionIDs = selectrec("question_id","dss_questions","process_id=".$pid);
	$qid = "";

	foreach ($questionIDs as $questionID) {
		$qid .=$questionID[0].",";
	}

	$qid = substr($qid,0,-1);

	return $qid;
}



?>