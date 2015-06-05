/* jQuery Gladminds
 * @anil @gladminds
 * 2015
 * gladminds.co
 */

/* Global Variables
 * ==============================
 */

/* ==============================
 * TODO -- Add and Edit the user Details.
 */

(function($, undefined) {

	// defaults
	var defaults = {
		editable: false,
		edit: function(){},
		add: function(){},
		modalHeading: [0],
		dealers: false
	};

	$.fn.usersTable = function( options ){
		// Extend
		options = $.extend(true, {},
	        defaults,
	        options
	    );
	    // returning html
	    this.each(function(i, _element) {
	    	var element = $(_element);
	    	var users_table = new UsersTable(element, options);
	    	users_table.render(); // It'll render elements
	    });

	    return this;
	};

	function UsersTable(element, options){
		var t = this; // Ref Object

		// exports
		t.options = options;
		t.render = render;

		//locals
		var body = $('body');
		var _element = element[0];
		var content;
		var header;
		var modalPopUp = $(getModalPopup());
		modalPopUp.appendTo(body); 
		var errorDiv = $(getErrorDiv());
		errorDiv.appendTo(body);
		var addButton;
		var userTable;
		var fields = options.fields;
		var headers = options.headers;
		var editable = options.editable;
		var getZones = [];
		var getLocals = new Object();
		getAllZones();
		var role = parseInt(options.role);
		var userAccID;
		var getAsms = [];
		// Check the condition only for RSMs and that to for dealer level
		if(role == 1 && options.dealers) getAllAsms();

		// html locals
		var form = $("<form/>");
		var div = $("<div/>");
		var input = $("<input/>");
		var a = $("<a/>");
		var table = $("<table/>");
		var tbody = $("<tbody/>");
		var thead = $("<thead/>");
		var tr = $("<tr/>");
		var th = $("<th/>");
		var td = $("<td/>");


		function render(){
			if (!content) {
	            initialRender();
	        }//
		}
		// First Time Render
		function initialRender(){
			element.addClass('ut'); // TODO

			content = div.clone().addClass('ut-content').css({'position':'relative'});
			showLoading();
			$.ajax({
				url: options.apiUrl,
				method: 'GET',
				dataType: 'json',
				success: function(result){
					if(options.accessURL)
						$.ajax({
					        url: options.accessIDAPI,
					        dataType: 'json',
					        method: 'GET',
					        success: function(zsm_data){
					            localStorage.setItem('zsm_id',zsm_data.objects[0].zsm_id);
					            userAccID = zsm_data.objects[0].zsm_id;
					            getContent(result);
								element.html(content);
								// modalPopUp.modal('show');
								hideLoading();
								header = div.clone().addClass('ut-header clearfix').css({'position':'header'});
								if(editable){
									getHeader();
								}
								header.prependTo(element);
					        },
					        error: function(e){

					        }
					    });
					else{
						getContent(result);
						element.html(content);
						// modalPopUp.modal('show');
						hideLoading();
						header = div.clone().addClass('ut-header clearfix').css({'position':'header'});
						if(editable){
							getHeader();
						}
						header.prependTo(element);
					}

				},
				error: function(e){
					alert("API ERROR");
					hideLoading();
				}
			});	

		}

		// Header
		function getHeader(){
			addButton = a.clone().attr({'href':'#'}).addClass('btn btn-success pull-right').text('+ Add');
			addButton.appendTo(header);

			addButton.click(function(){
				options.add(); // TODO-- callback
				
				modalPopUp.find('.modal-title').text('Add');

				formFields = getForm();

				formFields = $(formFields);

				// Keypress only for numbers
				formFields.find('#user_number').keypress(function(event){
					var code = event.keyCode ? event.keyCode : event.charCode;
		        
				       if(navigator.userAgent.indexOf('Firefox')>-1){
				               unicode = event.keyCode;
				               if(unicode==8 || unicode==39 || unicode==37 || unicode==46 || unicode==35 || unicode==36 || unicode==9){
				                       return true;
				               }
				       }
				       
				       if((code>=48 && code<=57)) {
				               return true;
				       }else if(code == 67 || 86){
				        return false;
				       }
				       else {
				               return false;
				       }
				});

				formFields.find('.form-submit').click(function(){
					var values = formFields.serializeObject();
					if(validateForm(values)){
						return false;
					}

					var data = "";
					// Smaple data
					// {"name":"TestASM", "id":"12345","email":"test@gmail.com","phone-number":"9999999999","area":"Mumbai", "zsm_id":"11111"} --ASM
					// {"username":"TestZSM","email":"test@gmail.com","phone-number":"9999999999", "asm_id":"12345"} -- DEALER
					// {"name":"TestZSM", "id":"11111","email":"test@gmail.com","phone-number":"9999999999","regional-office":"Mumbai"}
					console.log(values);
					if(role == 5){
						var data = {"name":values.user_name, "id":values.user_id,"email":values.user_email,"phone-number":values.user_number,"regional-office":values.regional_office};
					}

					if(role == 1 && options.dealers){
						var data = {"name":values.user_name, "username":values.user_id,"email":values.user_email,"phone-number":values.user_number, "asm_id":values.asm_id};	
					}else if(role == 1){
						var data = {"name":values.user_name, "id":values.user_id,"email":values.user_email,"phone-number":values.user_number,"area":values.user_area, "zsm_id":values.user_submitted_by};	
					}
					
					data = JSON.stringify(data);
					showLoading();
					$.ajax({
						url: options.curdAPIs.create,
						method: 'POST',
						data: data,
						dataType: 'json',
						success: function(result){
							hideLoading();
							alert(result.message);
							initialRender();
							modalPopUp.modal('hide');
						},
						error: function(e){
							alert("Try after some time.");
							console.log(e);
							hideLoading();
						}
					});	
				});

				modalPopUp.find("#modal_body").html(formFields);

				modalPopUp.modal('show');
			});
		}

		// Validate Form
		function validateForm(values){
			var flag = false;

			if(options.dealers){
				if(values.asm_id == ""){
					alert("Please Select ASM");
					flag = true;
					return flag;
				}
			}

			if(values.user_id == ""){
				alert("Please Enter ID");
				flag = true;
				return flag;
			}

			if(values.user_name == ""){
				alert("Please Enter Name");
				flag = true;
				return flag;
			}

			if(values.user_email == ""){
				alert("Please Enter Email");
				flag = true;
				return flag;
			}
			if(values.user_email != undefined)
			if(!isValidEmailAddress(values.user_email)){
				alert("Please Enter Valid Email");
				flag = true;
				return flag;
			}

			if(values.user_number == ""){
				alert("Please Enter Phone Number");
				flag = true;
				return flag;
			}
			if(false) // TODO -- needs to remove
			if(values.user_area == ""){
				alert('Please Enter Area');
				flag = true;
				return flag;
			}

			return flag;
		}

		// Valid Email
		function isValidEmailAddress(emailAddress) {
		    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
		    return pattern.test(emailAddress);
		};

		// Get Content
		function getContent(data){
			userTable = table.clone().addClass('table table-striped table-bordered table-hover table-green');
			
			// Header Done
			userTableHead = thead.clone();
			userTableHead.append(getTableHead());
			userTableHead.appendTo(userTable);
			
			// Body
			userTable.append(getTableBody(data));

			// Append Table
			userTable.appendTo(content);
			userTable.dataTable(); // Data Tables It's required separate Plug-in
		}
		
		// Table Header
		function getTableHead(){
			u_tr = tr.clone();
			for(var i=0; i<headers.length;i++){
				var fieldName = headers[i];				
				var t_th = th.clone().addClass('ut-uppercase').text(fieldName); // 
				u_tr.append(t_th);
			}
			if(editable)
				(th.clone().addClass('ut-uppercase').text("Actions")).appendTo(u_tr);
			return u_tr;
		}

		// Table Body
		function getTableBody(data){
			u_tbody = tbody.clone();
			
			$.each(data.objects, function(index, userDetails){
				u_tr = tr.clone();
				for (var i=0;i<fields.length;i++) {
					var x = fields[i];
					x = x.split('.');
					
					var obj_str = "userDetails";

					for(var k=0;k<x.length;k++){
						obj_str += "['"+x[k]+"']";
					}
					// field_obj.push(obj_str);
					var fieldValue = eval(obj_str);				
					var t_th = td.clone().text(fieldValue); // 
					u_tr.append(t_th);
				};
				if(editable)
					(td.clone()
						.html(a.clone().attr({'href':'#'}).text('Edit')
						.click(function(){
							options.edit(userDetails) // TODO -- Call Back
							// Model Title
							modalTitle = [];
							$.each(options.modalHeading, function(index,value){
								// var obj_str = "userDetails";
								var fi = options.fields[value];
								fi = fi.split('.');
								var obj_str = "userDetails";
								for(var d=0;d<fi.length;d++){
									obj_str += "['"+fi[d]+"']";
								}
								var gf = eval(obj_str);
								modalTitle.push(gf);
							});
							modalTitle = modalTitle.join(' - ');
							modalPopUp.find('.modal-title').text(modalTitle);

							// Edit Form 
							formFields = getForm(userDetails);


							formFields = $(formFields);

							// Keypress only for numbers
							formFields.find('#user_number').keypress(function(event){
								var code = event.keyCode ? event.keyCode : event.charCode;
					        
							       if(navigator.userAgent.indexOf('Firefox')>-1){
							               unicode = event.keyCode;
							               if(unicode==8 || unicode==39 || unicode==37 || unicode==46 || unicode==35 || unicode==36 || unicode==9){
							                       return true;
							               }
							       }
							       
							       if((code>=48 && code<=57)) {
							               return true;
							       }else if(code == 67 || 86){
							        return false;
							       }
							       else {
							               return false;
							       }
							});


							formFields.find('.form-submit').click(function(){
								var values = formFields.serializeObject();
								if(validateForm(values)){
									return false;
								}
								// Smaple data
								// {"name":"TestNewZSM","phone-number":"8888888888","regional-office":"Delhi"}
								// {"name":"TestASM", "id":"12345","email":"test@gmail.com","phone-number":"9999999999","area":"Mumbai", "zsm_id":"11111"}
								console.log(userDetails);
								if(role == 5){
									var id = userDetails.id;
									var data = {"name":values.user_name,"phone-number":values.user_number,"regional-office":values.regional_office}
								}
								else if(role == 1 && options.dealers){
									var id = userDetails.user.user.id;
									// TODO -- params are wrong
									var data = {"name":values.user_name, "username":values.user_id,"phone-number":values.user_number,"email":values.user_email, "asm_id":values.asm_id};
								}
								else if(role == 1){
									var id = userDetails.id
 									var data = {"name":values.user_name,"phone-number":values.user_number,"area":values.user_area, "zsm_id":values.user_submitted_by};
								}
								data = JSON.stringify(data);
								showLoading();
								$.ajax({
									//+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
									// localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
									url: options.curdAPIs.update+id+"/?access_token="+localStorage.getItem('access_token'),
									method: 'POST',
									data: data,
									dataType: 'json',
									success: function(result){
										hideLoading();
										alert(result.message);
										initialRender();
										modalPopUp.modal('hide');										
									},
									error: function(e){
										alert("Try after some time.");
										console.log(e);
										hideLoading();
									}
								});	
							});

							modalPopUp.find("#modal_body").html(formFields);
							modalPopUp.modal('show');

						})
					)
					.append('&nbsp;|&nbsp;')
					.append(
						a.clone().attr({'href':'#'}).text('Delete')
							.click(function(){
								if(confirm("Are you sure to Delete User?")){
									showLoading();
									$.ajax({
										//+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
										// localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
										url: options.curdAPIs.del+userDetails.resource_uri+"?access_token="+localStorage.getItem('access_token'),
										method: 'delete',
										dataType: 'json',
										success: function(result){
											hideLoading();
											alert("Deleted");
											initialRender();
										},
										error: function(e){
											alert("Try after some time.");
											console.log(e);
											hideLoading();
										}
									});
								}
								return false;
							})
					)
				
					).appendTo(u_tr);

				u_tbody.append(u_tr);
			})
			
			return u_tbody;
		}

		function getAllZones(){
			// var getZones = [];
			var url = options.getZonesUrl;
			showLoading();
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'json',
				success: function(result){
					hideLoading();
					$.each(result.objects, function(i,val){
						getZones.push({zone_id:val.zone_id, zone_name:val.zone_name});
					});
				},
				error: function(e){
					alert("API ERROR");
					hideLoading();
				}
			});

		}

		function getAllAsms(){
			var url = options.getAllAsmURI;
			showLoading();
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'json',
				success: function(result){
					hideLoading();
					$.each(result.objects, function(i,val){
						getAsms.push({asm_id:val.asm_id, asm_name:val.user.user.first_name});
						getLocals[val.asm_id] = val.area;
					});
				},
				error: function(e){
					alert("API ERROR");
					hideLoading();
				}
			});
		}

		// get Error Divs
		function getErrorDiv(){
			str = '<div><p class="bg-info" id="error_msg">Eror DIV</p></div>';

			// return str;
		}

		// Genarate Modal popup
		function getModalPopup(){
			str = '<div class="modal fade" id="myModal"> \
					  <div class="modal-dialog"> \
					    <div class="modal-content"> \
					      <div class="modal-header"> \
					        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
					        <h4 class="modal-title" id="modal_head">Modal title</h4> \
					      </div> \
					      <div class="modal-body" id="modal_body"> \
					        <p>One fine body&hellip;</p> \
					      </div>';

					      // <div class="modal-footer"> \
					      //   <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
					      //   <button type="button" class="btn btn-primary">Save changes</button> \
					      // </div> \
			str += 	'</div> \
					  </div> \
					</div>';
			return str;
		}

		// Get Form Fields
		function getForm(userDetails){
		   	var user_id = "",
		    	user_name = "",
		    	user_email = "",
		    	user_number = "";
		    	user_area = "";
		    	asm_id = "";
		    	user_submitted_by = userAccID;
		    	str = "";

		   	var nameLable = "";
		    	codeLabel = "";

		   	if(role == 5){ // Super Admin
		    	cadeLabel = "Employee Code";
		    	nameLable = "RSM Name";
		   	}
		   	if(role == 1){ // RSM
		    	cadeLabel = "Employee Code";
		    	nameLable = "ASM Name";
		   	}
		   	if(options.dealers){
		    	cadeLabel = "Dealer Code";
		    	nameLable = "Dealer Name";
		   	}

		   	// console.log(userDetails);

		   	if(userDetails != undefined){
		    	if(role == 1){ // ASM
		     		user_id = userDetails.asm_id
		    	}
			    user_id = userDetails.asm_id;
			    user_name = userDetails.user.user.first_name;
			    user_email = userDetails.user.user.email;
			    user_number = userDetails.user.phone_number;

			    user_area = userDetails.area;

			    if(role == 1 && !options.dealers){ // RSMs
			     user_submitted_by = userAccID;
			    }

			    if(role == 5){
			     user_area = userDetails.regional_office;
			     user_id = userDetails.zsm_id;
			    }

		   	}

		   	// For Dealers
		   	if(options.dealers && userDetails != undefined){
			    user_id = userDetails.dealer_id;
			    if(role == 1){
			     user_submitted_by = userDetails.asm.asm_id;
			     user_area = userDetails.user.address;
			     asm_id = userDetails.asm.asm_id
			    }
		   	}

		   	var id_disabled = (user_id != "") ? "disabled" : "";
		   	var email_disabled = (user_email != "" && !options.dealers) ? "disabled" : "";
		   	var asm_disabled = (options.dealers && userDetails != undefined) ? "disabled" : "";

		   	// var email_disabled = (user_email != "") ? "disabled" : "";



		   	str +=  '<form role="form" class="form-horizontal">';
		      
		   	if(options.dealers && role == 1){
			    // getAsms
			    str +=      '<div class="form-group"> \
			                       <label for="asm_id" class="col-sm-3 control-label">Select ASM</label> \
			                       <div class="col-sm-9"> \
			                    <select class="form-control" id="asm_id" name="asm_id" '+asm_disabled+'> \
			                     <option value="">Select ASM</option>';
			                for(i=0;i<getAsms.length;i++){
			                 var selected = (getAsms[i].asm_id == asm_id) ? "selected" : "";
			                 str += '<option value="'+getAsms[i].asm_id+'" '+selected+'>'+getAsms[i].asm_id+' - '+getAsms[i].asm_name+'</option>';
			                }
			    
			    str +=            '</select> \
			                        </div> \
			                    </div>';

		   	}

		      str +=      '<div class="form-group"> \
		                      <label for="user_id" class="col-sm-3 control-label">'+cadeLabel+'</label> \
		                      <div class="col-sm-9"> \
		                       <input type="text" class="form-control" id="user_id" name="user_id" placeholder="'+cadeLabel+'" value="'+user_id+'" '+id_disabled+'> \
		                      </div> \
		                  </div> \
		                  <div class="form-group"> \
		                      <label for="user_name" class="col-sm-3 control-label">'+nameLable+'</label> \
		                      <div class="col-sm-9"> \
		                       <input type="text" class="form-control" id="user_name" name="user_name" value="'+user_name+'" placeholder="'+nameLable+'"> \
		                      </div> \
		                  </div> \
		                  <div class="form-group"> \
		                      <label for="user_email" class="col-sm-3 control-label">Email</label> \
		                      <div class="col-sm-9"> \
		                       <input type="text" class="form-control" id="user_email" name="user_email" value="'+user_email+'" placeholder="Email" '+email_disabled+'> \
		                      </div> \
		                  </div> \
		                  <div class="form-group"> \
		                      <label for="user_number" class="col-sm-3 control-label">Phone Number</label> \
		                      <div class="col-sm-9"> \
		                       <input type="text" class="form-control" maxlength="10" id="user_number" name="user_number" value="'+user_number+'" placeholder="Phone Number"> \
		       </div> \
		       <input type="hidden" value="'+user_submitted_by+'" name="user_submitted_by" id="user_submitted_by" /> \
		                  </div>';
		                  
		      if(role != 5 && false){
		       // getLocals
		          str +=  '<div class="form-group" style=""> \
		                      <label for="user_area" class="col-sm-3 control-label">Area</label> \
		                      <div class="col-sm-9"> \
		                       <input type="text" class="form-control" id="user_area" name="user_area" value="'+user_area+'" placeholder="Area"> \
		       </div> \
		                  </div>';
		      }
		      
		      if(role == 5){ // 
		       str +=      '<div class="form-group"> \
		                       <label for="regional_office" class="col-sm-3 control-label">Regional Office</label> \
		                       <div class="col-sm-9"> \
		                    <select class="form-control" id="regional_office" name="regional_office"> \
		                     <option value="">Select Regional Office</option>';
		                for(i=0;i<getZones.length;i++){
		                 var selected = (user_area == getZones[i].zone_name) ? "selected" : "";
		                 str += '<option value="'+getZones[i].zone_name+'" '+selected+'>'+getZones[i].zone_name+'</option>';
		                }
		    
		    str +=            '</select> \
		                        </div> \
		                    </div>';
		      }

		      str +=   '<div class="form-action clearfix"> \
		                   <span type="submit" class="btn btn-default col-sm-offset-2 col-sm-2 pull-right form-submit">Submit</span> \
		                  </div> \
		              </form>';
		      return str;
		  }

	}


	$.fn.serializeObject = function(){
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};


})(jQuery);
