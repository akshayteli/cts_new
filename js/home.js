$(document).ready(function(){
	var token = localStorage.getItem('access_token');
	var user_id = localStorage.getItem('user_id');
	console.log(user_id);

	
	$.ajax({
		url : 'http://qa.bajaj.gladminds.co/v1/container-trackers/count/?access_token='+token,
		type : 'GET',
		dataType : 'json',
		success : function(dashboard, status) {
					// console.log(dashboard);
					create_dashboard(dashboard);
		},
		error : function(e) {
			if(e.status == 401) {
				alert("Something is wrong. Please try again");
				return;
			}
		}
	})
})

create_dashboard = function(dashboard) {
	
	for(i=0; i<dashboard.length; i++) {
		moreinfo = "open-indents.html?type="+dashboard[i].status;
		var ribbons = '<div class="col-lg-2 col-sm-6"><div class="circle-tile"><a href="#"><div class="circle-tile-heading dark-blue"><i class="fa fa-tasks fa-fw fa-3x"></i></div></a><div class="circle-tile-content dark-blue"><div class="circle-tile-description text-faded">'+dashboard[i].status+'</div><div id="count_open" class="circle-tile-number text-faded">'+dashboard[i].total+'</div><a href='+moreinfo+' class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';
		
		$("#cts-dashboard").append(ribbons);
	}

	
	
}
