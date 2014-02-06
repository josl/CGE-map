/* MAIN CGE JAVA SCRIPT*/
function showhide(button, id){ //SHOW and HIDE BUTTON FUNCTION
   element = document.getElementById(id).style
	if(button.value=='Show'){
		element.display='Block';
		button.value='Hide';
	}else{
		element.display='None';
		button.value='Show';
	};
};