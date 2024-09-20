// register jQuery extension for handeling tab index 
jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
        return $(el).is('a, button, :input, [tabindex]');
    }
});

$(document).on('keydown',':focusable',function(e){
	if (e.which == 13) {
		
		if ($(this).data("name") != 'id') {
			e.preventDefault();
			// Get all fucusable elements on the page.
			var $canFocuse = $(':focusable');
			// skip marked element
			if ($(this).data("name") == "ignoreNext") {
				var index = $canFocuse.index(this)+2;
			}else{
				var index = $canFocuse.index(this)+1;
			}
			
	        if (index >= $canFocuse.length) index = 0;
	        $canFocuse.eq(index).focus();
		}

	}

});

//refresh the table and get all patients.
function getAllPatients(){
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'patientsAjaxList',
		data:1,
		success:function(resp){
			if (resp.error) {

			}else{
				$("#tblPatients").find('tbody').empty();
				for (var i = 0; i < resp.length; i++) {
					$("#tblPatients").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp[i].id+'</td>'+
                            '<td class="hidden-xs">'+resp[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp[i].mobile+'</td>'+
                            '<td class="hidden-xs">'+resp[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp[i].age+'</td>'+
                            '<td class="hidden-xs">'+resp[i].address+'</td>'+
                            '<td class="hidden-xs">'+resp[i].created_at+'</td>'+
                        '</tr>'
						);	
				}
				
			}
		},
		error:function(err){
			alert('Could not connect to the Server');
		}
	});
}
$(document).on('click','#refPtTbl',function(){
	getAllPatients();
});

// Show patient's registration history modal
$(document).on('click','.btnPtHistory',function(){
	var pid = $(this).data('id');
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'ptglobSearch',
		data:{'pid':pid},
		success:function(resp){
			if (resp.error) {
				$("#ptRegHistory").find('.modal-body').html('No Data Available. !');
			}else{
				$("#ptSearchResult").html(resp);

			}
		},
		error:function(err){
			$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');
		}
	});
});

// do global search for patients 
$(document).on('click','#ptSearchKey',function(){
	var pid = $('input[name=ptSearchKey]').val();
	ptSearch(pid);
});

$(document).on('click','#ptSearchName',function(){
	var key = $('input[name=ptNamePhone]').val();
	searchPatientByName(key);
});

// Handle search on press enter key
$(document).on('keyup','#ptSearchId',function(e){
	if (e.which == 13) {
		e.preventDefault();
		alert('sdfsdfsdfsdfs');
		var key = $(this).val();
		ptSearch(key);
	}

});

$(document).on('keyup','#ptSearchPhone',function(e){
	e.preventDefault();
	var key = $(this).val();
	searchPatientByName(key);
});

function ptSearch(pid){
	if (pid !=null || pid != '') {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'ptglobSearch',
			data:{'pid':pid},
			success:function(resp){
				if (resp.error) {
					$("#ptRegHistory").find('.modal-body').html('No Data Available. !');
				}else{
					console.log(resp);
					$("#homeMainContainer").html(resp);
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
	}
}


function searchPatientByName(key){
	if (key !=null || key != '') {
		if (key.length > 2 ) {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				type:'post',
				url:'searchPtByName',
				data:{'searchKey':key},
				success:function(resp){
					if (resp.error) {
						$("#ptRegHistory").find('.modal-body').html('No Data Available. !');
					}else{
						console.log(resp);
						$("#homeMainContainer").html(resp);
						//$("#ptRegHistory").find('.modal-body').html(resp.name);

					}
				},
				error:function(err){
					$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

				}
			});	
		}else{
			$("#ptRegHistory").find('.modal-body').html('Please type Name or phone. !');
		}
	}	
}

// search any table and return the result.
function search(tbl,col,key,target){
	$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	    }
	});
	$.ajax({
		type:'post',
		url:'search',
		data:{'tbl':tbl,'col':col,'key':key},
		success:function(resp){
			if (resp.error) 
				target.find('tbody').html(resp.error);
			target.find('tbody').html(resp);
			// console.log(resp);
		},
		error:function(err){
			target.find('tbody').html('<tr> <td colspan = "7">'+
				' <div class = "alert alert-danger " > Connection Problem </div></td></tr>');
		}
	});
}

$(document).on('click','#btnEditPt',function(e){
	e.preventDefault();
	$('#info-container').hide();
	$('#edit-container').show();
});
$(document).on('keypress','.searchF',function(e){
	var key = e.which;
	var tbl = $(this).data('tbl');
	var col = $(this).data('col');
	var target = $(this).parent().parent().parent().parent();

	var section = target.data('section');

	var searchKey = $(this).val();
	console.log('start searching ... ');
	// target.find('tbody').html('sdfsdfsdf');
	if (searchKey.length >= 3) {
		search(tbl,col,searchKey,target);
	}
	


});

$(document).on('change','.searchF',function(e){
	var key = e.which;
	var tbl = $(this).data('tbl');
	var col = $(this).data('col');
	var target = $(this).parent().parent().parent().parent();
	var section = target.data('section');
	console.log('the section is : '+section);

	var searchKey = $(this).val();
	console.log('start searching ... ');
	search(tbl,col,searchKey,target);
});

// do search on press enter 
$('input[name=ptSearchKey]').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    $('#ptSearchKey').click();
    return false;  
  }
}); 

/** register new visit for a patient 
*
*
**/
$(document).on('click','#ptNewVisit',function(){
	var requireFee = $(this).data('fee');
	var pid = $(this).data('pid');
	if (requireFee == 1) {
		$("#mdlNewVisit").modal('show');	
	}else{
		$("#mdlNewVisit").modal('show');
		$("#mdlNewVisit").find('.modal-body').html('<div class="row"><div class="col-md-12" > '+
			'<h3 >Congrates! No Fee Required for this appointment</h3> </div></div>');
	}
	
});
// submit new visit
$(document).on('click','.btnCreateVisit',function(){
	var requireFee = $('#ptNewVisit').data('fee');
	var pid = $('#ptNewVisit').data('pid');
	var visitFee = 0;
	var finalVisitFee = 0;
	var date = new Date();
	var curMonth = date.getMonth();
	var curYear = date.getYear();
	if (requireFee == 1) {
		visitFee = $('input[name=PtVisitFee]').val();
		finalVisitFee = visitFee

	}
	$.ajax({
		type:'post',
		url:'ptNewVisit',
		data:{'pid':pid,'visitFee':finalVisitFee},
		success:function(resp){
			if (resp.error) {
				$("#mdlNewVisit").find('.modal-body').html('OOPS! Failed to create Appointment');
			}else{
				$("#mdlNewVisit").modal('hide');
				$("#tblPastVisits tbody").append('<tr><td>'+resp.created_at+'</td>'+
					'<td> '+resp.registration_fee+' </td>');
				$("#mdlNewVisit").modal('hide');

			}
		},
		error:function(err){
			$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

		}
	});
});


/********** Add OPD Result *************/
$(document).on('click','.btnSaddveOpd',function(){
	$(this).html('<i class="fa fa-spinner fa-spin"></i>');
	$(this).prop('disabled',true);
	var pid = $(this).data('pid');
	var vid = $(this).data('vid');
	alert(pid+'  -----   '+vid);
	$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
	});
	$.ajax({
		type:'post',
		url:'addOPD',
		data:{
			'vaod':$('input[name = vaod]').val(),
			'vaos':$('input[name = vaos]').val(),
			'phod':$('input[name = phod]').val(),
			'phos':$('input[name = phos]').val(),
			'glod':$('input[name = glod]').val(),
			'glos':$('input[name = glos]').val(),
			'nvod':$('input[name = nvod]').val(),
			'nvos':$('input[name = nvos]').val()
		},
		success:function(resp){
			if (resp.error) {
				console.log(resp.error);
				$('.mdl-alert').css('display','block');
			}else{
				$('#mdlAddOPD').find('.btnAddOpd').html('Save');
				$('#mdlAddOPD').find('.btnAddOpd').prop('disabled',false);
				$("#mdlAddOPD").modal('hide');
			}

		},
		error:function(err){
			console.log('error sending data .. ');
			console.log(err);
		}
	});

});
/********** End Add OPD Result *********/
/*************** searh patient (opd) **************/
// do global search By Name  for OPP patients 
$(document).on('click','#opdPtSearchName',function(){
	var pid = $('#searchByName').val();
	if (pid !=null || pid != '') {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'ptSearchOpdByName',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].visit_date+'</td>'+
                            '<td class="center">'+
                                '<div class="visible-md visible-lg hidden-sm hidden-xs">'+
                                '<a href="#mdlAddOPD" data-toggle = "modal" class="btn btn-xs btn-blue tooltips" data-placement="top" data-original-title="insert OPD Result"><i class="fa fa-stethoscope"></i></a>'+
                                '</div>'+
                            '<td class="center" >'+
                                '<a href="/addOpdResult/'+resp.patients[i].vid+'" '+
									' class="btn btn-xs btn-blue tooltips "'+
									 ' data-vid="'+resp.patients[i].vid+'" >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
	}
});

$(document).on('keyup','#searchByName',function(e){
	if (e.which == 13) {
		e.preventDefault();
		var pid = $(this).val();
		if (pid !=null || pid != '') {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				type:'post',
				url:'ptSearchOpdByName',
				data:{'pid':pid},
				success:function(resp){
					//console.log(resp);
					if (resp.error) {
						$("#opdtblPatients ").find('tbody').empty();
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
	                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
	                    '</tr>'
						);
					}else{
						console.log(resp.patients.length);
						$("#opdtblPatients ").find('tbody').empty();
						for (var i = resp.patients.length - 1; i >= 0; i--) {
							$("#opdtblPatients ").find('tbody').append(
							'<tr>'+
	                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].visit_date+'</td>'+
	                            '<td class="center" >'+
	                                '<a href="/addOpdResult/'+resp.patients[i].vid+'" '+
										' class="btn btn-xs btn-blue tooltips "'+
										 ' data-vid="'+resp.patients[i].vid+'" >'+
										 '<i class="fa fa-stethoscope"></i></a>'+
	                            '</td>'+
	                        '</tr>'
							);
						}
						//$("#ptRegHistory").find('.modal-body').html(resp.name);

					}
				},
				error:function(err){
					$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

				}
			});	
		}
	}
});
// do global search By Serial Number  for OPP patients 
$(document).on('click','#opdPtSearchSerial',function(){
	var pid = $('#searchBySerial').val();
	if (pid !=null || pid != '') {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'ptSearchOpdBySerial',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].visit_date+'</td>'+
                            '<td class="center" >'+
                                '<a href="/addOpdResult/'+resp.patients[i].vid+'" '+
									' class="btn btn-xs btn-blue tooltips "'+
									 ' data-vid="'+resp.patients[i].vid+'" >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
	}
});

// do global search By Serial Number  for OPP ------ ENTER ------

$(document).on('keyup','#searchBySerial',function(e){
	if (e.which == 13) {
		e.preventDefault();
		var pid = $(this).val();
		if (pid !=null || pid != '') {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				type:'post',
				url:'ptSearchOpdBySerial',
				data:{'pid':pid},
				success:function(resp){
					//console.log(resp);
					if (resp.error) {
						$("#opdtblPatients ").find('tbody').empty();
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
	                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
	                    '</tr>'
						);
					}else{
						console.log(resp.patients.length);
						$("#opdtblPatients ").find('tbody').empty();
						for (var i = resp.patients.length - 1; i >= 0; i--) {
							$("#opdtblPatients ").find('tbody').append(
							'<tr>'+
	                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
	                            '<td class="hidden-xs">'+resp.patients[i].visit_date+'</td>'+
	                            '<td class="center" >'+
	                                '<a href="/addOpdResult/'+resp.patients[i].vid+'" '+
										' class="btn btn-xs btn-blue tooltips "'+
										 ' data-vid="'+resp.patients[i].vid+'" >'+
										 '<i class="fa fa-stethoscope"></i></a>'+
	                            '</td>'+
	                        '</tr>'
							);
						}
						//$("#ptRegHistory").find('.modal-body').html(resp.name);

					}
				},
				error:function(err){
					$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

				}
			});	
		}
	}
});

/****************** do global search By Serial  for OPD Done patients  ********/
$(document).on('click','#searchOpdDoneSerial',function(){
	var pid = $('#searchOPDBySerial').val();
	if (pid !=null || pid != '') {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'searchOpdDoneSerial',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].mobile+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="center">'+
                                '<a href="/completedOpd/'+resp.patients[i].id+'" '+
									' class="btn btn-xs btn-blue tooltips " >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
	}
});

$(document).on('keyup','#searchOPDBySerial',function(e){
	if (e.which == 13) {
		e.preventDefault();
		var pid = $(this).val();
		if (pid !=null || pid != '') {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
		$.ajax({
			type:'post',
			url:'searchOpdDoneSerial',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].mobile+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="center">'+
                                '<a href="/completedOpd/'+resp.patients[i].id+'" '+
									' class="btn btn-xs btn-blue tooltips " >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
		}
	}
});

/****************** End Do global serach by Serial for OPD Done Patients **********/

/****************** do global search By Name  for OPD Done patients  ********/
$(document).on('click','#searchOpdDoneName',function(){
	var pid = $('#searchOPDByName').val();
	if (pid !=null || pid != '') {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'searchOpdDoneName',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].mobile+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="center">'+
                                '<a href="/completedOpd/'+resp.patients[i].id+'" '+
									' class="btn btn-xs btn-blue tooltips " >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
	}
});

$(document).on('keyup','#searchOPDByName',function(e){
	if (e.which == 13) {
		e.preventDefault();
		var pid = $(this).val();
		if (pid !=null || pid != '') {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
		$.ajax({
			type:'post',
			url:'searchOpdDoneName',
			data:{'pid':pid},
			success:function(resp){
				//console.log(resp);
				if (resp.error) {
					$("#opdtblPatients ").find('tbody').empty();
					$("#opdtblPatients ").find('tbody').append(
					'<tr>'+
                        '<td class="hidden-xs alert alert-danger" colspan = "7" > No Patient Found.</td>'+
                    '</tr>'
					);
				}else{
					console.log(resp.patients.length);
					$("#opdtblPatients ").find('tbody').empty();
					for (var i = resp.patients.length - 1; i >= 0; i--) {
						$("#opdtblPatients ").find('tbody').append(
						'<tr>'+
                            '<td class="hidden-xs">'+resp.patients[i].serial+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].name+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].fname+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].mobile+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].sex+'</td>'+
                            '<td class="hidden-xs">'+resp.patients[i].age+'</td>'+
                            '<td class="center">'+
                                '<a href="/completedOpd/'+resp.patients[i].id+'" '+
									' class="btn btn-xs btn-blue tooltips " >'+
									 '<i class="fa fa-stethoscope"></i></a>'+
                            '</td>'+
                            '</td>'+
                        '</tr>'
						);
					}
					//$("#ptRegHistory").find('.modal-body').html(resp.name);

				}
			},
			error:function(err){
				$("#ptRegHistory").find('.modal-body').html('OOPS!! Could not connect to the Server.');

			}
		});	
		}
	}
});

/****************** End Do global serach by name for OPD Done Patients **********/



/*** ADD ROW IN DIAGNOSIS TABLE ********************/
$(document).on("click","#addRow",function(e){
	e.preventDefault();
	$("#tblDiagnosis tbody").append(
		'<tr>'+
			'<td>'+
			'<input type="text" name="dod[]" class="form-control" placeholder="Diagnosis ... ">'+
			'</td>'+
			'<td>'+
			'<input type="text" name="dos[]" class="form-control" placeholder="Diagnosis ... ">'+
			'</td>'+
		'</tr>'
		);
});

$(document).on('submit',"#refractionDet",function(e){
	e.preventDefault();
	var glassType = $("#glassType").val(); 
	var gtypeod = $("input[name=gtypeod]").val(); 
	var gtypeos = $("input[name=gtypeos]").val();
	if (glassType == null || glassType == "") {
		swal('Warning','Please Select Glass Type','warning');
	} 

	else if (gtypeod == null || gtypeod == "") {
		swal('Warning','Please Select General type OD','warning');
	} 
	else if (gtypeos == null || gtypeos == "") {
		swal('Warning','Please fill General Type OS ','warning');
	}
	else{
	var data = $(this).serialize();
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'/saveRefracDet',
			data:data,
			success:function(resp){
				console.log(resp);
				if (!resp.error) {
					window.location.href = '/refractWaitingList';
				}
			},
			error:function(error){
				swal('OOPS!',resp.msg,'success');
				console.log(err);

			}
		});	
	}
	
});

$(document).on('click','#btnAdvice',function(e){
	e.preventDefault();
	var data = $("#frmAdvice").serialize();
	console.log(data);
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/saveAdvice',
		data:data,
        success:function(resp){
            if (!resp.error) {
                toastr["success"]("Advise Saved Successfully", "Congrates!");
                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
                // empty the form
                $("#frmAdvice").trigger("reset");
            }else{
                toastr["error"]("Unable to Save Advise", "OPPS!!");

                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
            }

        },
        err:function(err){
	        toastr["error"]("Problem Connecting to Server", "OPPS!!");

	        toastr.options = {
	          "closeButton": false,
	          "debug": true,
	          "newestOnTop": true,
	          "progressBar": true,
	          "positionClass": "toast-top-right",
	          "preventDuplicates": false,
	          "onclick": null,
	          "showDuration": "300",
	          "hideDuration": "1000",
	          "timeOut": "5000",
	          "extendedTimeOut": "500",
	          "showEasing": "swing",
	          "hideEasing": "linear",
	          "showMethod": "fadeIn",
	          "hideMethod": "fadeOut"
	        }

        }
	});	
});


// save Disease and drug which the doctor specify for a patient.
$(document).on('click','#btnSaveDisDrug',function(e){
	e.preventDefault();
	var data = $("#frmDrugDis").serialize();
	console.log('the raw data');
	console.log(data);
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/saveRx',
		data:data,
        success:function(resp){
            if (!resp.error) {
                toastr["success"]("RX Saved Successfully", "Congrates!");
                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 

			    $('#frmDrugDis').find('input:text').val(''); 
			    $('input:checkbox').removeAttr('checked'); 
            }else{
                toastr["error"]("Unable to Save RX", "OPPS!!");

                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
            }

        },
        err:function(err){
	        toastr["error"]("Problem Connecting to Server", "OPPS!!");

	        toastr.options = {
	          "closeButton": false,
	          "debug": true,
	          "newestOnTop": true,
	          "progressBar": true,
	          "positionClass": "toast-top-right",
	          "preventDuplicates": false,
	          "onclick": null,
	          "showDuration": "300",
	          "hideDuration": "1000",
	          "timeOut": "5000",
	          "extendedTimeOut": "500",
	          "showEasing": "swing",
	          "hideEasing": "linear",
	          "showMethod": "fadeIn",
	          "hideMethod": "fadeOut"
	        }

        }
	});	
});

// delete services from patient

$(document).on('click','#btnRemoveSr',function(e){
	e.preventDefault();
	var sid = $(this).data('sid');
	var row = $(this).closest('tr');
	console.log('the raw data');
	console.log(sid);
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/removePatientServices',
		data:{'sid':sid},
        success:function(resp){
            if (!resp.error) {
                toastr["success"]("Service was deleted successfully", "Congrates!");
                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
                row.remove();
            }else{
                toastr["error"]("Unable to Delete Services", "OPPS!!");

                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
            }

        },
        err:function(err){
	        toastr["error"]("Problem Connecting to Server", "OPPS!!");

	        toastr.options = {
	          "closeButton": false,
	          "debug": true,
	          "newestOnTop": true,
	          "progressBar": true,
	          "positionClass": "toast-top-right",
	          "preventDuplicates": false,
	          "onclick": null,
	          "showDuration": "300",
	          "hideDuration": "1000",
	          "timeOut": "5000",
	          "extendedTimeOut": "500",
	          "showEasing": "swing",
	          "hideEasing": "linear",
	          "showMethod": "fadeIn",
	          "hideMethod": "fadeOut"
	        }

        }
	});	
});
// delete drug from patient
$(document).on('click','.btnRemoveDrug',function(e){
	e.preventDefault();
	var did = $(this).data('did');
	var row = $(this).closest('tr');
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/removePatientDrug',
		data:{'did':did},
        success:function(resp){
            if (!resp.error) {
                toastr["success"]("Drug was deleted successfully", "Congrates!");
                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
                row.remove();
            }else{
                toastr["error"]("Unable to Delete Drug", "OPPS!!");

                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
            }

        },
        err:function(err){
	        toastr["error"]("Problem Connecting to Server", "OPPS!!");

	        toastr.options = {
	          "closeButton": false,
	          "debug": true,
	          "newestOnTop": true,
	          "progressBar": true,
	          "positionClass": "toast-top-right",
	          "preventDuplicates": false,
	          "onclick": null,
	          "showDuration": "300",
	          "hideDuration": "1000",
	          "timeOut": "5000",
	          "extendedTimeOut": "500",
	          "showEasing": "swing",
	          "hideEasing": "linear",
	          "showMethod": "fadeIn",
	          "hideMethod": "fadeOut"
	        }

        }
	});	
});


// add comment for pateint visit to refraction and iop
$(document).on('click','#btnSaveComment',function(e){
	e.preventDefault();
	var data = $("#frmComment").serialize();
	console.log('the raw data');
	console.log(data);
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/saveComment',
		data:data,
        success:function(resp){
            if (!resp.error) {
                toastr["success"]("Comment sent Successfully", "Congrates!");
                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 

			    $('#frmDrugDis').find('input:text').val(''); 
			    $('input:checkbox').removeAttr('checked'); 
            }else{
                toastr["error"]("Unable to send comment", "OPPS!!");

                toastr.options = {
                  "closeButton": false,
                  "debug": true,
                  "newestOnTop": true,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "500",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                } 
            }

        },
        err:function(err){
	        toastr["error"]("Problem Connecting to Server", "OPPS!!");

	        toastr.options = {
	          "closeButton": false,
	          "debug": true,
	          "newestOnTop": true,
	          "progressBar": true,
	          "positionClass": "toast-top-right",
	          "preventDuplicates": false,
	          "onclick": null,
	          "showDuration": "300",
	          "hideDuration": "1000",
	          "timeOut": "5000",
	          "extendedTimeOut": "500",
	          "showEasing": "swing",
	          "hideEasing": "linear",
	          "showMethod": "fadeIn",
	          "hideMethod": "fadeOut"
	        }

        }
	});	
});
//
$(document).on('click','#btnAddOpr',function(e){
	e.preventDefault();
	$(
		'<label class="control-label">Other Operations</label>'+
		'<input type="text" class="form-control" name="otherOpr[]">'
	).insertBefore(this);
});

$(document).on('click','#btnAddExam',function(e){
	e.preventDefault();
	$(	'<label class="control-label">Other Exam</label>'+
		'<input type="text" class="form-control" name="otherExam[]">'
	).insertBefore(this);
});

$(document).on('click','#btnAddRetina',function(e){
	e.preventDefault();
	$(	'<label class="control-label">Other Exam</label>'+
		'<input type="text" class="form-control" name="otherExam[]">'
	).insertBefore(this);
});

$(document).on('click','#btnAddDis',function(e){
	e.preventDefault();
	$('<div class = "form-group">'+
		'<input type="text" class="form-control" name="otherDis[]" placeholder="Type Diseases name "'+
		'</div>'
		).insertBefore($(this));
});
// var div = 0;
// $(document).on('change','#diseas',function(){
// 	div++;
// 	var disId = $(this).val();
// 	console.log(disId);
// 	var disName = $(this).text();
// 	$.ajaxSetup({
// 		headers:{
// 			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
// 		}
// 	});
// 	$.ajax({
// 		type :'post',
// 		url:'/getDisDrug',
// 		data:{'disId':disId},
// 		success:function(resp){
// 			createAccord(div,disName,resp);
// 		},
// 		error:function(err){
// 			swal('OOPS!','There seem to be problem connecting to server','error');
// 		}
// 	});
	
// });

// set drug company automitacillay when drug is changed



$(document).on('change','#drug_id',function(e){
	e.preventDefault();
	
	var id = $(this).val();

	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/getDrutDetails',
		data:{'id':id},
		success:function(resp){
			console.log(resp.drug.type);
			console.log(resp.type);
			if (!resp.err) {
				$("#orderItemType").val(resp.drug.type);
				$("#drugUnit").val(resp.drug.unit);
				$("#mgml").val(resp.drug.mgml);
				$("#drugCompany").val(resp.drug.company);
				$("#drugName").val(resp.drug.name);
			}
		},
		error:function(err){
			swal('OOPS!','There is problem connecting to server','error');

		}
	});
});
// add drug
$(document).on('change','#drugs',function(e){
	e.preventDefault();
	var drId = $(this).val();
	var drName = $(this).text();
	$("#drugTblBody").append('<tr>'+
		'<input type="hidden" name="drId[]" value = "'+drId+'" >'+
		'<td>'+drName+'</td>'+
		'<td> <input type="text" name="quantity[]" placeholder=" Quantity" ></td>'+
		'<td> <input type="text" name="dosage[]" placeholder=" Dosage i.e. 1*2 5" ></td>'+
		'<td width = "10%" class = "hover-cont"><a href = "" class = "a-hover" ><i class = "fa fa-trash-o" > </i></a></td>'+
		'</tr>'
		);
});
// remove table row on button click
$(document).on('click','.a-hover',function(e){
	e.preventDefault();
	$(this).parent().parent().remove();
});
// handle accordion close button
$(document).on('click','.accordion-close',function(e){
	e.preventDefault();
	$(this).parent().parent().parent().remove();
});
// create accordion dynamically
function createAccord(num,disName, drugs){
	var rows = [];
	for(x in drugs){
		var checked = '';
		if (drugs[x].is_default == 1) {
			checked = 'checked';
		}
		rows.push('<tr>'+
					'<td>'+drugs[x].drug_name+'</td>'+
					'<td><input type ="text" value ="'+drugs[x].dosage+'" ></td>'+
					'<td><input type ="text" value ="'+drugs[x].usage_duration+'" ></td>'+
					'<td><input type ="text" value ="'+drugs[x].usage_details+'" ></td>'+
					'<td>'+
						'<input type="checkbox" class = "chk" name="default[]" '+checked+' >'+
					'</td>'+
				'</tr>');	
	}
	$('<div class="panel-group accordion" id="accordion'+num+'">'+
		'<div class="panel panel-white">'+
			'<div class="panel-heading custom-heading" style = "background-color: #e7e9e9!important;border-radius: 5px!important;" >'+
				'<h5 class="panel-title custom-title" >'+
				'<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion'+div+'" href="#collapse'+div+'">'+
					'<i class="icon-arrow"></i> '+disName+
				'</a></h5> '+
				'<h5 class="panel-title accordion-close">'+
					'<a class="btn btn-xs btn-link " href="#">'+
					'<i class="fa fa-times"></i>'+
				'</a></h5>'+
			'</div>'+
			'<div id="collapse'+div+'" class="panel-collapse collapse in" style="">'+
				'<div class="panel-body">'+
					'<table class="table table-bordered">'+
						'<tr>'+
							'<th>Drug Name</th>'+
							'<th>Dosage</th>'+
							'<th>Usage Duration</th>'+
							'<th>Usage Details</th>'+
							'<th>Check</th>'+
						'</tr>'+
							rows+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>'+
	  '</div>').insertBefore('#endColipse');	
}

// handle checkbox click issue
$(document).on('click','.chk',function(e){
	//e.preventDefault();
	if ($(this).checked) {
		swal('alert!','checked ','success');
	}else{
		swal('alert!','unchecked ','warning');
	}
	
});
/*********************  Drug Store ***********************/

// Hide error, warning and success messages after 10 seconds
 setTimeout(function() {
        $(".temp").css('display', 'none');
    }, 5000);

 $(document).on('change','#perunit',function(){
 	var v = $(this).val();
 	if(v != 0){
 		$("#pricepu").attr('placeholder','Price per '+v);	
 		$("#pricepu").prop('disabled',false);	
 	}else{
 		$("#pricepu").attr('placeholder','');	
 		$("#pricepu").prop('disabled',true);		
 	}
 });

  $(document).on('change','#perunit2',function(){
 	var v = $(this).val();
 	var un = $("#unit").val();
 	if(v != 0){
 		$("#pricepu").attr('placeholder','Price per '+v);	
 		$("#pricepu").prop('disabled',false);
 		$("#pPerUnit").attr('placeholder',v+' (s) per '+un);		
 		$("#pPerUnit").prop('disabled',false);	
 	}else{
 		$("#pricepu").attr('placeholder','');			
 		$("#pPerUnit").attr('placeholder','');		
 		$("#pPerUnit").prop('disabled',true);		
 	}
 });
  $(document).on('keyup','.calc',function(){
  	var qty = $("#qty").val();
  	var ppu = $("#pPerUnit").val();
  	var price = $("#pricepu").val();
  	var perunit = $("#perunit2").val();
  	var totalPrice = 0;
  	if(perunit != 0){
  		totalPrice = qty*ppu*price;
  		$("#totalPrice").val(totalPrice);
  		$("#totalPrice").prop('disabled',false);
  		$("#totalPrice").prop('readonly',true);
  	}else{
  		totalPrice = qty*price;
  		$("#totalPrice").val(totalPrice);
  		$("#totalPrice").prop('disabled',false);
  		$("#totalPrice").prop('readonly',true);	
  	}
  });


 $(document).on('keyup','input[name=drEnPrice]',function(){
 	var qty = $('input[name=drQty]').val();
 	var price = $(this).val();
 	$('input[name=drTnPrice]').val(qty*price);

 }); 
 $(document).on('keyup','input[name=drExPrice]',function(){
 	var qty = $('input[name=drQty]').val();
 	var price = $(this).val();
 	$('input[name=drTxPrice]').val(qty*price);

 });

// open service payment model and set some values
$(document).on('click','.btnApprovePay',function(){
	var sid = $(this).data("sid");
	swal({
	  title: "Are you sure?",
	  text: "Bye clicking OK You will Confirm the Payment",
	  icon: "warning",
	  buttons: true,
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'/confirmServicePayment',
			data:{'sid':sid},
			success:function(resp){
				console.log(resp);
				if (!resp.err) {
				    swal("Congrates! You Approved the Payment!", {
				      icon: "success",
				    });
				    window.location.href = '/unapproved_services/'+vid;
				}
			},
			error:function(err){
				swal('OOPS!','There is problem connecting to server','error');

			}
		});
	  } else {
	    swal("You did not Confirm the Payment!");
	  }
	});
});

// calculate the final price of a service when user types the discount
$(document).on('keyup','#sDiscount',function(){
	var price = $("#sPrice").val();
	var discount = $("#sDiscount").val();
	var payment = price - discount;
	$("#sPayment").val(payment);
});
/// reception : save and confirm the payment.
$(document).on('submit','#frmConfPay',function(e){
	e.preventDefault();
	var pid = $("#pid").val();
	var data = $(this).serialize();
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/addServiceDiscount',
		data:data,
		success:function(resp){
			console.log(resp);
			if (!resp.err) {
				console.log(resp);
				$("#mdlConfPayment").modal('hide');
				//window.location.href = '/patient_services/'+pid;
				//swal('Good job','Successfully saved! ','success');
			}
		},
		error:function(err){
			swal('OOPS!','There is problem connecting to server','error');

		}
	});
});



// get details of a drug issued for patient by doctor
$(document).on('click','#btnOpenDModal',function(e){
	e.preventDefault();
	var id = $(this).data('id');
	var pid = $(this).data('pdid');
	var rowIndex = $(this).parent().parent().index();
	console.log('index : '+rowIndex);

	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/getPtDrugDetails',
		data:{'id':id},
		success:function(resp){
			
			if (!resp.err) {
				console.log(resp.data[0].unit);
				console.log('price : '+resp.data[0].exit_price);
				var qty = resp.data[0].quantity;
				if (qty>0 && qty<10) {
					$("#adQty").addClass('alert alert-warning');

				}else if (qty>10) {
					$("#adQty").addClass('alert alert-success');
				}
				else{
					$("#adQty").addClass('alert alert-danger');
				}
				$("#adQty").html(qty);
				$("#dUnit").val(resp.data[0].unit);
				$("#dPrice").val(resp.data[0].exit_price);
				$("#ptDid").val(id);
				$("#dPid").val(pid);
				$("#rowIndex").val(rowIndex+1);
			}
		},
		error:function(err){
			swal('OOPS!','There is problem connecting to server','error');

		}
	});
});

  $(document).on('keyup','#dQty',function(){

  	var qty = $(this).val();
  	var price = $("#dPrice").val();
  	var discount = $("#dDiscount").val();
  	var finalPrice = price*qty;
	var totalPrice = finalPrice - discount;

	$("#dTotal").val(totalPrice);


  });

$(document).on('keyup','#dDiscount',function(e){

  	var discount = $(this).val();
  	var price = $("#dPrice").val();
  	var qty = $("input[name=quantity]").val();
  	console.log('price '+price);
  	console.log('discount '+discount);
  	console.log('quantity '+qty);

  	var finalPrice = price*qty;
	var totalPrice = finalPrice - discount;

	$("#dTotal").val(totalPrice);
		if (e.which == 13) {
		$("#btnExecDrug").click();
	}

  });




$(document).on('click','#btnExecDrug.backup',function(e){
	e.preventDefault();

	var pid = row.find(".pid").val();
	var id = $("#ptDid").val();
	var quantity = $("input[name=quantity]").val();
	var price = $("#dPrice").val();
	var unit = $("#dUnit").val();
	var discount = $("#dDiscount").val();
	var total = quantity*price;
	var payable = $("#dTotal").val();
	var pid = $("#dPid").val();
	var rowIndex = $("#rowIndex").val();
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/savePtDrugDetails',
		data:{'id':id,'quantity':quantity,'price':price,'unit':unit,'discount':discount,'total':total,'pid':pid},
		success:function(resp){
			
			if (!resp.err) {
				// swal('OOPS!','There is problem connecting to server','success');
				var tbl = $("#drugTbl");
				var row = $('tr', tbl);

				row.eq(rowIndex).find("td:eq(2)").html(quantity);
				row.eq(rowIndex).find("td:eq(3)").text(price);
				row.eq(rowIndex).find("td:eq(4)").html(discount);
				row.eq(rowIndex).find("td:eq(5)").html(total);
				row.eq(rowIndex).find("td:eq(6)").html(payable);
				calcGrandTotal();
				$("#execute").modal('hide');
			}
		},
		error:function(err){
			swal('OOPS!','There is problem connecting to server','error');

		}
	});
});

function calcGrandTotal(){
	var sum = 0;
	$('.payable').each(function(){
		var value = $(this).text();
		if (!isNaN(value) && value.length != 0 ) {
			sum += parseFloat(value); 
		}
	});
	$("#gTotal").text(sum);
}

// save drug order item 

$(document).on('click','#saveDrugOrderItem',function(e){
	e.preventDefault();
	var orderId = $("#orderId").val();
	var drug_id = $("#drug_id").val();
	var price = $("#orderItemPrice").val();
	var quantity = $("#orderItemQty").val();
	console.log('quantity : '+quantity);
	console.log('price : '+price);
	var type = $("#orderItemType").val();
	var unit = $("#drugUnit").val();
	var mgml = $("#mgml").val();
	var company = $("#drugCompany").val();
	var name = $("#drugName").val();

	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/saveDrugOrderItem',
		data:{'orderId':orderId,'quantity':quantity,'price':price,'drug_id':drug_id},
		success:function(resp){
			
			if (!resp.err) {
				// $("#mdlOrderDetails").modal('hide');
				//$("#closeMdl").click();
				// swal('OOPS!','There is problem connecting to server','success');
				$('#tblOrderItemDetails').find('tbody').append(
					'<tr>'+
						'<td>'+type+'</td>'+
						'<td>'+name+'</td>'+
						'<td>'+company+'</td>'+
						'<td>'+unit+'</td>'+
						'<td>'+mgml+'</td>'+
						'<td>'+quantity+'</td>'+
						'<td>'+price+'</td>'+
						'<td class = "hidden-print"> <a href="" class = "removeRow" data-oid="'+resp.item+'" >remove</a></td>'+
					'</tr>'
				);
				$("#orderItemType").val('');
				$("#drugUnit").val('');
				$("#mgml").val('');
				$("#drugCompany").val('');
				$("#drugName").val('');
				$("#orderItemPrice").val('');
				$("#orderItemQty").val('');
				console.log(resp.item);
				
			}else{
				console.log(resp.msg);
				var msg = resp.msg;
				swal('OOPS!','Could not save the data','error');
			}
		},
		error:function(err){
			console.log(err);
			swal('OOPS!','There seems to be error connecting to the server','error');

		}
	});
});


// remove order item while creating the order.
$(document).on('click','.removeRow',function(e){
	e.preventDefault();
	var id = $(this).data('oid');
	var row = $(this).parent().parent();
	$.ajaxSetup({
		headers:{
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	$.ajax({
		type:'post',
		url:'/removeDrugOrderItem',
		data:{'id':id},
		success:function(resp){
			
			if (!resp.err) {
				row.remove();
				console.log('item '+resp.item);
				
			}else{
				console.log(resp.msg);
				swal('OOPS!',resp.msg,'error');
			}
		},
		error:function(err){
			console.log(err);
			swal('OOPS!',err,'error');

		}
	});
});

/********************* End Drug Store ***********************/
/**************** End: search patient (opd) *****************/
	
/********************** drug order section *****************/

$(document).on('click','#btnNewDrugOrder1',function(){

	if ($('input[name=toCompany]').val()=='') { 
		$('input[name=toCompany]').addClass('has-error');
	}else {
		$('input[name=toCompany]').removeClass('has-error');
		$(this).html('<i class="fa fa-spinner fa-spin"></i>');
		$(this).prop('disabled',true);
		$.ajaxSetup({
	    headers: {
	        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	    }
		});
		$.ajax({
			type:'post',
			url:'add',
			data:{'tocompany':$('input[name = toCompany]').val(),'supplier':$('input[name = supplier]').val()},
			success:function(resp){
				if (resp.error) {
					console.log(resp.error);
					console.log(resp.msg);
					$('.mdl-alert').css('display','block');
				}else{
					$('#mdlNewOrder').find('#btnNewDrugOrder').html('Save');
					$('#mdlNewOrder').find('#btnNewDrugOrder').prop('disabled',false);
					$("#mdlNewOrder").modal('hide');
					window.location.href = '/addDrugOrderDetails';
				}

			},
			error:function(err){
				console.log('error sending data .. ');
				console.log(err);
			}
		});
	}

});

$(document).on('change','.type',function(){
	//alert('this is sdfk ');
	var type = $(this).val();
	var currentRow = $(this).parent().parent();
	// alert(currentRow.find('.name').val());
	$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
	});
	$.ajax({
		type:'post',
		url:'getDrugByType',
		data:{'type':type},
		success:function(resp){
			if (resp.error) {
				console.log(resp.error);
				console.log(resp.msg);
				$('.mdl-alert').css('display','block');
			}else{
				console.log(resp.drug);
				currentRow.find('.name').html('<option value=""> Name </>');
				//currentRow.children('option:not(:first)').remove();
				for (var i = 0; i < resp.drug.length; i++) {
					currentRow.find('.name').append('<option value="'+
					resp.drug[i].id+'">'+resp.drug[i].name+'</>');
				}
				
			}

		},
		error:function(err){
			console.log('error sending data .. ');
			console.log(err);
		}
	});
});

// $(document).on('change','.name',function(){
// 	//alert('this is sdfk ');
// 	var id = $(this).val();
// 	var currentRow = $(this).parent().parent();
// 	var unit = currentRow.find('.unit');
// 	var aqty = currentRow.find('.aqty');
// 	var price = currentRow.find('.price');
// 	var type = currentRow.find('.type');

// 	$.ajaxSetup({
//     headers: {
//         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//     }
// 	});
// 	$.ajax({
// 		type:'post',
// 		url:'getDrugById',
// 		data:{'id':id},
// 		success:function(resp){
// 			if (resp.error) {
// 				console.log(resp.error);
// 				console.log(resp.msg);
// 			}else{
// 				console.log(resp.drug);
// 				console.log('dfs '+resp.drug[0].type);	
// 				unit.html(resp.drug[0].unit);
// 				aqty.text(resp.drug[0].quantity);
// 				price.val(resp.drug[0].exit_price);
// 				type.val(resp.drug[0].type);
// 			}

// 		},
// 		error:function(err){
// 			console.log('error sending data .. ');
// 			console.log(err);
// 		}
// 	});
// });

// calculate the total price of misc drug
$(document).on('keyup','.calc-qty',function(){

	var qty = $(this).val();
	
	var price = parseFloat($(".price").val());

	var discount = $(this).parent().parent().find('.calc-discount').val();
	var total = qty*price - discount;
	$(this).parent().parent().find('.totalPrice').val(total);
	sumGrandTotal();
});

// calculate the total price of misc drug
$(document).on('keyup','.calc-discount',function(e){
	var code = e.keyCode || e.which;
	var discount = $(this).val();
	var price = parseFloat($(".price").val());
	var qty = $(this).parent().parent().find('.calc-qty').val();
	var total = qty*price - discount;
	$(this).parent().parent().find('.totalPrice').val(total);
	sumGrandTotal();
	if (code == 13 ) {
		e.preventDefault();
	}
});
function sumGrandTotal(){
	var sum = 0;
	$('.tPrice').each(function(){
		var value = $(this).find('.totalPrice').val();
		if (!isNaN(value) && value.length != 0 ) {
			sum += parseFloat(value); 
		}
	});
	$("#gTotal").text(sum);
}
$(document).on('click','#btnAddMiscDrug',function(e){
	e.preventDefault();
	var footer = $(this).parent().parent();
	var row = '<tr>'+
		'<td width="10%">'+
			'<select name="type" class="form-control type" required >'+
                '<option value=""> Type </option>'+
                '<option value="tablet">Tablet</option>'+
                '<option value="syrip">Syrup</option>'+
                '<option value="iontment">Iontment</option>'+
                '<option value="drop">Drop</option>'+
                '<option value="serom">Serom</option>'+
                '<option value="solution">Solution</option>'+
                '<option value="soup">Soup</option>'+
                '<option value="injection">Injection</option>'+
                '<option value="ampoule">Ampoule</option>'+
                '<option value="vial">Vial</option>'+
                '<option value="capsule">Capsule</option>'+
                '<option value="shampoo">Shampoo</option>'+
                '<option value="cream">Cream</option>'+
                '<option value="cream">Other</option>'+
			'</select>'+
		'</td>'+
		'<td width="15%">'+
			'<select name="drug_id[]" class="form-control name">'+
                '<option value="" required > Name  </option>'+
			'</select>	'+
		'</td>'+
		'<td class="bg bg-info unit" width="5%">'+
			
		'</td>'+
		'<td class="bg bg-info aqty" width="5%"></td>'+
		'<td width="10%">'+
			'<input type="text" class="form-control" name="dosage[]" placeholder="Dosage">'+
		'</td>'+
		'<td class="bg bg-info" width="5%">'+
			'<input type="text" class="form-control readonly price" name="price[]" readonly>'+
		'</td>'+
		'<td width="5%">'+
			'<input type="text" class="form-control calc-qty" name="qty[]" placeholder="Quantity" required>'+
		'</td>'+
		'<td width="5%">'+
			'<input type="text" class="form-control calc-discount" name="discount[]" placeholder="Dsicount">'+
		'</td>'+
		'<td class="bg bg-info tPrice">'+
			'<input type="text" class="form-control readonly totalPrice" name="total[]" data-name="id" readonly>'+
		'</td>'+
		'<td width="5%" class="hidden-print">'+
			'<a href="" class="remove-row"><i class="fa fa-times" style="color: red;"></i> </a>'+
		'</td>'+
	'</tr>';
	$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
	});
	$.ajax({
		type:'post',
		url:'issueMiscDrugAjax',
		success:function(resp){
			if (resp.error) {
				console.log(resp.error);
				console.log(resp.msg);
			}else{
				console.log(resp.drug);
				console.log('dfs '+resp.drug[0].type);
				$(row).insertBefore(footer);
				$(".type").focus();
			}

		},
		error:function(err){
			console.log('error sending data .. ');
			console.log(err);
		}
	});
});

// remove the closest parent row of a button
$(document).on('click','.remove-row',function(e){
	e.preventDefault();
	$(this).parent().parent().remove();
});
/****************** Employee Section ********************/
$(document).on('click','#btnAddRel',function(e){
	e.preventDefault();
	$("#panelRel").append('<div class="form-group">'+
                        	'<div class="col-md-3">'+
                            	'<input type="text" name="rname[]" class="form-control" placeholder=" name " required >'+ 
                        	'</div>'+
                        	'<div class="col-md-3">'+
                            	'<input type="text" name="rfname[]" class="form-control"  placeholder="  Fahter name ">'+
                        	'</div>'+
	                        '<div class="col-md-3">'+
	                            '<input type="text" name="rcontact[]" class="form-control"  placeholder="Contact Number ">'+
	                        '</div>'+
	                        '<div class="col-md-3">'+
	                            '<input type="text" name="relation[]" class="form-control"  placeholder="Relation">'+
	                        '</div>'+
                    	'</div>'+
	                    '<div class="form-group">'+
	                        '<div class="col-md-6">'+
	                            '<input type="text" name="raddress[]" class="form-control" placeholder="Address" >'+
	                        '</div>'+
	                        '<div class="col-md-6">'+
	                            '<input type="text" name="occupation[]" class="form-control" placeholder="Occupation" >'+
	                        '</div>'+
	                    '</div>');
});

$(document).on('click','#btnAddEdu',function(e){
	e.preventDefault();
	$("#panelEdu").append('<div class="form-group">'+
                        	'<div class="col-md-3">'+
	                            '<select class="form-control" name="level[]" >'+
	                                '<option value="12 grade"> 12 Grade </option>'+
	                                '<option value="14 grade"> 14 Grade </option>'+
	                                '<option value="bachelor"> Bachelor </option>'+
	                                '<option value="md"> MD </option>'+
	                                '<option value="master"> Master </option>'+
	                                '<option value="phd"> PHD </option>'+
	                                '<option value="other"> other </option>'+
	                            '</select>'+
                        	'</div>'+
	                        '<div class="col-md-9">'+
	                            '<input type="text" name="institute[]" class="form-control" required="" placeholder="Institute/University">'+
	                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<div class="col-md-3">'+
                            '<input type="text" name="started[]" class="form-control" required="" placeholder="from Year">'+
                        '</div>'+
                        '<div class="col-md-3">'+
                                '<input type="text" name="graduated[]" class="form-control" required="" placeholder="To Year">'+
                        '</div>'+
                        '<div class="col-md-6">'+
                                '<input type="file" name="docs[]" class="form-control" multiple>'+
                        '</div>'+
                    '</div>');
});
/****************** End Employee Section ****************/


/****************** Start: Lab Section ******************/
/// Labrand : Delete Test .
$(document).on('submit','#frmDelTest',function(e){
	e.preventDefault();
	// var data = $(this).serialize();
	//alert(data);
	var tid = $(this).find('.tid').val();
	swal({
	  title: "Are you sure?",
	  text: "Bye clicking OK Department Will be deleted Perminantly",
	  icon: "warning",
	  buttons: true,
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'/deleteDepartment',
			data:{'tid':tid},
			success:function(resp){
				console.log(resp);
				if (!resp.err) {
				    swal("Congrates! Department has been deleted.", {
				      icon: "success",
				    });
				    window.location.href = '/departmentList';
				}
			},
			error:function(err){
				swal('OOPS!','There is problem connecting to server','error');

			}
		});
	  } else {
	    swal("You did not Delete the Test.");
	  }
	});

});
/****************** End: Lab Section ********************/

// Ajax Based Delete *************************************


$(document).on('click','.btnDelete',function(e){
	e.preventDefault();
	
	var recId = $(this).data('recid');
	var backUrl = $(this).data('backurl');
	var tbl = $(this).data('tbl');

	swal({
	  title: "آیا مطمین هستید?",
	  text: "ریکارد حذف شده قابل برگشت نمی باشد",
	  icon: "warning",
	  buttons: true,
	  dangerMode: true,
	})
	.then((willDelete) => {
	  if (willDelete) {
		$.ajaxSetup({
			headers:{
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
		$.ajax({
			type:'post',
			url:'deleteRecord',
			data:{'recId':recId,'tbl':tbl,'backUrl':backUrl},
			success:function(resp){
				console.log(resp);
				if (!resp.err) {
				    swal("ریکارد حذف شد", {
				      icon: "success",
				    });
				    window.location.href = backUrl;
				}
			},
			error:function(err){
				swal('اوه','خطا در ارتباط با سرور','error');

			}
		});
	  } else {
	    swal("ریکارد حذف نشد");
	  }
	});

});

// block or unblock the user -- called by admin

// open service payment model and set some values
$(document).on('click','.btnChangeStatus',function(e){
	e.preventDefault();
	var uid = $(this).data('uid');
	var status = $(this).data('status');

	// change the message based on status
	if (status == 0) {
		swal({
		  title: "Are you sure?",
		  text: "Blocked User can't login to the system",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				type:'post',
				url:'/blockUser',
				data:{'uid':uid,'status':status},
				success:function(resp){
					console.log(resp);
					if (!resp.err) {
					    swal("Congrates! Successfully blocked the user!", {
					      icon: "success",
					    });
					    window.location.href = '/userProfile/'+uid;
					}
				},
				error:function(err){
					swal('OOPS!','There is problem connecting to server','error');

				}
			});
		  } else {
		    swal("You did not block the user!");
		  }
		});
	}else{
		swal({
		  title: "Are you sure?",
		  text: "Unblblocked User can login to the system",
		  icon: "warning",
		  buttons: true,
		  dangerMode: true,
		})
		.then((willDelete) => {
		  if (willDelete) {
			$.ajaxSetup({
				headers:{
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				}
			});
			$.ajax({
				type:'post',
				url:'/blockUser',
				data:{'uid':uid,'status':status},
				success:function(resp){
					console.log(resp);
					if (!resp.err) {
					    swal("Congrates! Successfully unblocked the user!", {
					      icon: "success",
					    });
					    window.location.href = '/userProfile/'+uid;
					}
				},
				error:function(err){
					swal('OOPS!','There is problem connecting to server','error');

				}
			});
		  } else {
		    swal("You did not block the user!");
		  }
		});
	}

});




$(document).on('click','.btnChangeFee',function(e){
    e.preventDefault();
    var row = $(this).closest('tr');
    var feeCell = row.find('.tdFee');

    feeCell.find('.oldFee').hide();
    feeCell.find('.newFee').show();
    $(this).removeClass('btnChangeFee');
    $(this).removeClass('btn-info');
    $(this).addClass('btnSaveFee');
    $(this).addClass('btn-success');
    $(this).prop('type','submit');
    $(this).html('Save Changes <span class = "fa fa-save" > </span>');
});

