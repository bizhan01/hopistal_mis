
$(document).ready(function() {
	// ask for delete (course list, course edit, course more)pages.
	$(document).on('click','.sureToDelete',function(e){
		e.preventDefault();
		var id = $(this).data('cid');
		var msg = $(this).data('msg');
		var conf = confirm(msg);
		if (conf == true) {
			window.location.href = '/courseListDelete/'+id;
		}
	});

	// checking for password and confirm password.
	$('.isEqualToPass').on('blur', function(){
		var password = $('.pass').val();
		var confPassword = $('.isEqualToPass').val();
		if (password != confPassword) {
			alert("رمز عبور با تکرار رمز عبور یکسان نیست");
			$('.pass').val("");
			$(this).val("");
		}
	});

	// ask for delete in (category list, category edit, category more.) pages.
	$(document).on('click', '.cConfDelete', function(e){
		e.preventDefault();
		var id = $(this).data('cid');
		var msg = $(this).data('msg');
		var conf = confirm(msg);
		if (conf) {
			window.location.href = '/catListDelete/'+id;
		}
	});

	// ask for delete sub category. -----------------------------------------
	$(document).on('click', '.sCatDelete', function(e) {
		e.preventDefault();
		var id = $(this).data('scID');
		var msg = $(this).data('msg');
		var conf = confirm(msg);
		if (conf) {
			window.location.href = '/subCatDelete/'+id;
		}
	});

	// ask for delete period ----------------------------------------------------
	$(document).on('click', '.cpDelete', function(e) {
		e.preventDefault();
		var id = $(this).data('cpid');
		var msg = $(this).data('cpmsg');
		var conf = confirm(msg);
		if (conf) {
			window.location.href = '/CoursePeriodDelete/'+id;
		}
	});

	// edit period
	$(".periodEdit").click(function(){
		var periodTitle = $(this).data('ptitle');
		var periodId = $(this).data('peid');
		$("#editPeriodTitle").val(periodTitle);
		$('#editPeriodId').val(periodId);
	});

	// ask for teacher delete ----------------------------------------------------
	$(document).on('click', '.tDelete', function(e) {
		e.preventDefault();
		var tid = $(this).data('tid');
		var tdmsg = $(this).data('tdmsg');
		var conf = confirm(tdmsg);
		if (conf) {
			window.location.href = '/teacherDelete/'+tid;
		}
	});

	// ask for student delete -------------------------------------------------
	$(document).on('click', '.sDelete', function(e) {
		e.preventDefault();
		var sid = $(this).data('sid');
		var sdmsg = $(this).data('sdmsg');
		var conf = confirm(sdmsg);
		if (conf) {
			window.location.href = '/studentDelete/'+sid;
		}
	});

	// ask for users delete. ---------------------------------------------------
	$(document).on('click','.uDelete',function(e){
		e.preventDefault();
		var uid = $(this).data('uid');
		var udmsg = $(this).data('udmsg');
		var conf = confirm(udmsg);
		if (conf == true) {
			window.location.href = 'usersDelete/'+uid;
		}
	});

	// ask for credit delete. ---------------------------------------------------
	$(document).on('click','.crDelete',function(e){
		e.preventDefault();
		var crid = $(this).data('crid');
		var crmsg = $(this).data('crmsg');
		var conf = confirm(crmsg);
		if (conf == true) {
			window.location.href = '/deleteCredit/'+crid;
		}
	});
	
	// ask for credit delete. ---------------------------------------------------
	$(document).on('click','.tcDelete',function(e){
		e.preventDefault();
		var tcid = $(this).data('tcid');
		var tcmsg = $(this).data('tcmsg');
		var conf = confirm(tcmsg);
		if (conf == true) {
			window.location.href = '/tcDelete/'+tcid;
		}
	});

	// ask for period delete. ---------------------------------------------------
	$(document).on('click','.pDelete',function(e){
		e.preventDefault();
		var pid = $(this).data('pid');
		var pmsg = $(this).data('pmsg');
		var conf = confirm(pmsg);
		if (conf == true) {
			window.location.href = '/periodDelete/'+pid;
		}
	});

	
	
	// add photo and photo caption in courseLesson. ----------------------------
	$(document).on('click','#btnAddLessonPhoto',function(e){
		e.preventDefault();
		$("<div class='form-group'>"+
			"<div class='c-upload-btn-wrapper'>"+
				"<button class='btn btn-sm btn-default c-btn-color' >"+
					"<i class='fa fa-cloud-upload'></i> بارگزاری عکس"+
				"</button>"+
				"<input type='file' name='photo[]' accept='image/*''>"+
			"</div>"+
			"<input type='text' class='form-control' name='photo_caption[]' placeholder='عنوان عکس'>"+
		"</div>").insertAfter('.photoDiv');
	});
	// add file and photo caption in courseLesson. ----------------------------
	$(document).on('click','#btnAddLessonFile',function(e){
		e.preventDefault();
		$("<div class='form-group'>"+
			"<div class='c-upload-btn-wrapper'>"+
				"<button class='btn btn-sm btn-default c-btn-color' >"+
					"<i class='fa fa-cloud-upload'></i> بارگزاری  فایل"+
				"</button>"+
				"<input type='file' name='file[]' accept='image/*''>"+
			"</div>"+
			"<input type='text' class='form-control' name='file_caption[]' placeholder='عنوان  فایل'>"+
		"</div>").insertAfter('.fileDiv');
	});
	// add video and photo caption in courseLesson. ----------------------------
	$(document).on('click','#btnAddLessonVideo',function(e){
		e.preventDefault();
		$("<div class='form-group'>"+
			"<div class='c-upload-btn-wrapper'>"+
				"<button class='btn btn-sm btn-default c-btn-color' >"+
					"<i class='fa fa-cloud-upload'></i> بارگزاری  ویدیو"+
				"</button>"+
				"<input type='file' name='video[]' accept='image/*''>"+
			"</div>"+
			"<input type='text' class='form-control' name='video_caption[]' placeholder='عنوان  ویدیو'>"+
		"</div>").insertAfter('.videoDiv');
	});

	// choose / select type of question
	$("#question_select").change(function(){
		if ($("#select_disc_ans").is(":selected")) { 
			$("#quest_with_4_ans").hide();
			$("#discribtional_question").show();
		} else {
			$("#discribtional_question").hide();
			$("#quest_with_4_ans").show();
		}
	});

	// ask for question delete. ---------------------------------------------------
	$(document).on('click','.questionDelete',function(e){
		e.preventDefault();
		var questionid = $(this).data('questionid');
		var questionmsg = $(this).data('questionmsg');
		var conf = confirm(questionmsg);
		if (conf == true) {
			window.location.href = '/questionsDelete/'+questionid;
		}
	});

	// ask for exam delete. ---------------------------------------------------
	$(document).on('click','.examDelete',function(e){
		e.preventDefault();
		var examid = $(this).data('examid');
		var exammsg = $(this).data('exammsg');
		var conf = confirm(exammsg);
		if (conf == true) {
			window.location.href = '/examDelete/' + examid;
		}
	});

	// ask for exam delete admin. ----------------------------------
	$(document).on('click','.examDelete',function(e){
		e.preventDefault();
		var examid = $(this).data('examid');
		var exammsg = $(this).data('exammsg');
		var conf = confirm(exammsg);
		if (conf == true) {
			window.location.href = '/examDeleteAdmin/' + examid;
		}
	});

	// ask for question delete / admin page. --------------------------------
	$(document).on('click','.questionDelete',function(e){
		e.preventDefault();
		var questionid = $(this).data('questionid');
		var questionmsg = $(this).data('questionmsg');
		var conf = confirm(questionmsg);
		if (conf == true) {
			window.location.href = '/questionsDelete/'+questionid;
		}
	});


	


});
