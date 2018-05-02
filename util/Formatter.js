jQuery.sap.declare("sap.ui.veh_campanias.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.veh_campanias.util.Formatter = {
    
	statusText :  function (value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	
	statusState :  function (value) {
		var map = sap.ui.demo.myFiori.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	getfecha : function(fecha){
       	if(fecha != "" && fecha != null){
	       	var valueDate = fecha;
		    var d = new Date(valueDate);
			d.setDate(d.getDate() + 1);
			d = d.toLocaleDateString();
			var parts = d.split('/');
			if(parts[0] < 10) parts[0] = '0' + parts[0];
			if(parts[1] < 10) parts[1] = '0' + parts[1];
			return parts[0] + '.' + parts[1] + '.' + parts[2];
       	}
       	else{
       		return "";
       	}
	},
	quantity :  function (value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},
	
	time : function (value)
	{
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({  
			     source:{pattern:"KKmmss"},  
			     pattern: "KK:mm:ss"}  
			);  
			    value = oDateFormat.parse(value);  
				return oDateFormat.format(new Date(value)); 
	},
	
	dates : function (value) {
		if (value =="00000000"){
		 return ;
		} else{
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({  
			     source:{pattern:"MM-dd-yyyy"},  
			     pattern: "dd-MM-yyyy"}  
			);  		
	        value = oDateFormat.parse(value);  
			return oDateFormat.format(new Date(value)); 		
		}
	},
	//Función para quitar los 0
	integer: function(num){
		try {
			return (num) ? parseInt(num) : num;
		} catch (err) {
			return "Not-A-Number";
		}
	},
	borrar0izalfanumerico: function(valor){
		if(valor != null && valor != undefined && valor != ""){
			var val = valor;
			for (var i = 0; i < valor.length; i++) {
				if(val.substr(0, 1) == 0){
					val=val.substr(1, val.length-1);
				}
			}
			return val;
		}else{
			return valor;
		}
	},
	//Autor :: Israel Espinoza León
	getSexo: function(value){
		if(value == "M"){
			return "Masculino";
		}else if(value == "F"){
			return "Femenino";
		}else{
			return;
		}
	},
	getEspecialidad: function(value){
		switch(value){
			case "0001":
				return "DESARROLLO DE SOFTWARE";
				break;
			case "0002":
				return "ADMINISTRACIÓN INDUSTRIAL";
				break;
			case "0003":
				return "MECÁNICA AUTOMATRIZ";
				break;
		}
	},
	getIdioma: function(value){
		if(value == "01"){
			return "Español";
		}else if(value == "02"){
			return "Inglés";
		}else{
			return;
		}
	}
};