jQuery.sap.require("sap.ui.veh_campanias.util.Formatter");
jQuery.sap.require("sap/ui/model/json/JSONModel");
jQuery.sap.require("sap/m/MessageToast");
jQuery.sap.require("sap/m/Table");
// jQuery.sap.require("sap/m/semantic");

sap.ui.define([
   "sap/ui/veh_campanias/controller/BaseController",
   "sap/m/MessageBox",
   "sap/ui/model/json/JSONModel",
   'sap/m/Token',
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator",
   "sap/ui/veh_campanias/util/Formatter"
], function (BaseController, MessageBox, JSONModel, Token,Filter,FilterOperator,formatter) {
    "use strict";
    var thes;
    var urlGlobal = "http://sap-ides-tt7.t77secure.biz:50000/sap/bc/zie_personas";
    var especialidades = [];
    return BaseController.extend("sap.ui.veh_campanias.controller.Home", {
      formatter: formatter,
      onInit : function () {
        especialidades = [];
        thes = this;
        thes.onRefreshTable();
        thes.onGetSpecialties();
      },
      //::::::::::::::::::FUNCIONES PARA REFRESCAR LA TABLA:::::::::::::::::://
      //::::::::::::::::::PROGRAMADOR :: ISRAEL ESPINOZA LEÓN:::::::::::::::::://
      onRefreshTable: function(){
        sap.ui.core.BusyIndicator.show(0);
        $.ajax({
          method: 'GET',
          url: urlGlobal + '?ID=01',
          success:function(result){
            if(!result[0].type){
              var Model = new JSONModel(result);
              thes.getView().byId("TBPersonas").setModel(Model);  
            }
          },
          error: function(xhr,status,error){
            sap.m.MessageBox.error("Error de conexión");
          },
          complete: function(){
            sap.ui.core.BusyIndicator.hide();
          }
        });
      },
      //::::::::::::::::::FUNCIONES PARA EL REGISTRO DE LA PERSONA:::::::::::::::::://
      //::::::::::::::::::PROGRAMADOR :: ISRAEL ESPINOZA LEÓN:::::::::::::::::://
      onAgregarPersona: function(){
        thes.DialogAdd = sap.ui.xmlfragment("idDialogAdd", "sap.ui.veh_campanias.popup.AgregarPersona", thes);
        thes.DialogAdd.open();
        var data = new JSONModel(especialidades);
        var especialidad = sap.ui.getCore().byId("idDialogAdd--idEspecialidad").setModel(data);
      },
      onAceptAddPersona: function(){
        sap.ui.core.BusyIndicator.show(0);
        var idNombres = sap.ui.getCore().byId("idDialogAdd--idNombreCompleto").getValue().toUpperCase();
        var idApe_Pat = sap.ui.getCore().byId("idDialogAdd--idApePat").getValue().toUpperCase();
        var idApe_Mat = sap.ui.getCore().byId("idDialogAdd--idApeMat").getValue().toUpperCase();
        if(sap.ui.getCore().byId("idDialogAdd--idMas").getSelected() == true){
          var idSexo = "M";
        }else if(sap.ui.getCore().byId("idDialogAdd--idFem").getSelected() == true){
          var idSexo = "F";
        }
        var idEspe = sap.ui.getCore().byId("idDialogAdd--idEspecialidad").getSelectedKey();
        var idIdio = sap.ui.getCore().byId("idDialogAdd--idIdioma").getSelectedKey().toUpperCase();
        var validarCampos  = true;

        if(idNombres == "" || idApe_Pat == "" || idApe_Mat == "" || idSexo == "" || idEspe == "" || idIdio == ""){
          validarCampos = false;
        }

        if(validarCampos){
          $.ajax({
            url: urlGlobal + '?ID=04&IDNOMBRE=' + idNombres + '&IDAPEPAT=' + idApe_Pat + '&IDAPEMAT=' + idApe_Mat + '&IDSEXO=' + idSexo + '&IDESPECIALIDAD=' + idEspe + '&IDIDIOMA=' + idIdio,
            method: 'GET',
            success: function(result){
              if(result[0].type == "S"){
                sap.m.MessageBox.success(result[0].message, {
                  onClose: function(){
                    thes.DialogAdd.destroy();
                    thes.onRefreshTable();
                  }
                });
              }else{
                sap.m.MessageBox.error(result[0].message, {
                  onClose: function(){
                    thes.DialogAdd.destroy();
                  }
                });
              }
            },
            error: function(xhr,status,error){
              sap.m.MessageBox.error("Error de Conexión");
            },
            complete: function(){
              sap.ui.core.BusyIndicator.hide();
            }
          });
        }else{
          sap.m.MessageBox.warning("Por favor, complete todos los datos");
          sap.ui.core.BusyIndicator.hide();
        }
      },
      onCancelAPersona: function(){
        thes.DialogAdd.destroy();
      },
      //::::::::::::::::::FUNCIONES PARA LA MODIFICACIÓN DE LA PERSONA:::::::::::::::::://
      //::::::::::::::::::PROGRAMADOR :: ISRAEL ESPINOZA LEÓN:::::::::::::::::://
      onEditarPersona: function(){
        sap.ui.core.BusyIndicator.show(0);

        var itemSelected = this.getView().byId("TBPersonas").getSelectedItem();
        if(itemSelected != null){
          thes.DialogModify = sap.ui.xmlfragment("idDialogModify", "sap.ui.veh_campanias.popup.ModificarPersona", thes);
          thes.DialogModify.open();
          var data = new JSONModel(especialidades);
          sap.ui.getCore().byId("idDialogModify--idEspecialidad").setModel(data);

          var idPersona = itemSelected.getCells()[0].mProperties.text;
          $.ajax({
            url: urlGlobal + '?ID=03&IDPERSONA=' + idPersona,
            method: 'GET',
            success: function(result){    
              sap.ui.getCore().byId("idDialogModify--idPersona").setValue(result[0].idpersona);
              sap.ui.getCore().byId("idDialogModify--idNombreCompleto").setValue(result[0].nombres);
              sap.ui.getCore().byId("idDialogModify--idApePat").setValue(result[0].apellido_pat);
              sap.ui.getCore().byId("idDialogModify--idApeMat").setValue(result[0].apellido_mat);
              if(result[0].sexo == "M"){
                sap.ui.getCore().byId("idDialogModify--idMas").setSelected(true);
              }else{
                sap.ui.getCore().byId("idDialogModify--idFem").setSelected(true);
              }
              sap.ui.getCore().byId("idDialogModify--idEspecialidad").setSelectedKey(result[0].especialidad);
              sap.ui.getCore().byId("idDialogModify--idIdioma").setSelectedKey(result[0].idiomas);
            },
            error: function(xhr,status,error){
              sap.m.MessageBox.error("Error de Conexión");
            },
            complete: function(){
              sap.ui.core.BusyIndicator.hide();
            }
          });
        }else{
          sap.m.MessageBox.warning("Por favor, seleccione una fila");
          sap.ui.core.BusyIndicator.hide();
        }
      },
      onModifyPersona: function(){
        sap.ui.core.BusyIndicator.show(0);
        var idPersona = sap.ui.getCore().byId("idDialogModify--idPersona").getValue().toUpperCase();
        var idNombres = sap.ui.getCore().byId("idDialogModify--idNombreCompleto").getValue().toUpperCase();
        var idApe_Pat = sap.ui.getCore().byId("idDialogModify--idApePat").getValue().toUpperCase();
        var idApe_Mat = sap.ui.getCore().byId("idDialogModify--idApeMat").getValue().toUpperCase();
        if(sap.ui.getCore().byId("idDialogModify--idMas").getSelected() == true){
          var idSexo = "M";
        }else if(sap.ui.getCore().byId("idDialogModify--idFem").getSelected() == true){
          var idSexo = "F";
        }
        var idEspe = sap.ui.getCore().byId("idDialogModify--idEspecialidad").getSelectedKey();
        var idIdio = sap.ui.getCore().byId("idDialogModify--idIdioma").getSelectedKey();
        var validarCampos  = true;

        if(idNombres == "" || idApe_Pat == "" || idApe_Mat == "" || idSexo == "" || idEspe == "" || idIdio == ""){
          validarCampos = false;
        }

        if(validarCampos){
          $.ajax({
            url: urlGlobal + '?ID=05&IDPERSONA=' + idPersona +'&IDNOMBRE='+ idNombres + '&IDAPEPAT=' + idApe_Pat + '&IDAPEMAT=' + idApe_Mat + '&IDSEXO=' + idSexo + '&IDESPECIALIDAD=' + idEspe + '&IDIDIOMA=' + idIdio,
            method: 'GET',
            success: function(result){
              if(result[0].type == "S"){
                sap.m.MessageBox.success(result[0].message, {
                  onClose: function(){
                    thes.DialogModify.destroy();
                    thes.onRefreshTable();
                  }
                });
              }else{
                sap.m.MessageBox.error(result[0].message, {
                  onClose: function(){
                    thes.DialogModify.destroy();
                  }
                });
              }
            },
            error: function(xhr,status,error){
              sap.m.MessageBox.error("Error de Conexión");
            },
            complete: function(){
              sap.ui.core.BusyIndicator.hide();
            }
          });
        }else{
          sap.m.MessageBox.warning("Por favor, complete todos los datos");
          sap.ui.core.BusyIndicator.hide();
        }
      },
      onCancelMPersona: function(){
        thes.DialogModify.destroy();
      },
      //::::::::::::::::::FUNCIONES PARA LA ELIMINACIÓN DE LA PERSONA:::::::::::::::::://
      //::::::::::::::::::PROGRAMADOR :: ISRAEL ESPINOZA LEÓN::::::::::::::::::::::::::://
      onEliminarPersona: function(){
        sap.ui.core.BusyIndicator.show(0);
        var itemSelected = this.getView().byId("TBPersonas").getSelectedItem();
        if(itemSelected != null){
          var idPersona = itemSelected.getCells()[0].mProperties.text;
          $.ajax({
            url: urlGlobal + '?ID=06&IDPERSONA=' + idPersona,
            method: 'GET',
            success: function(result){
              if(result[0].type == "S"){
                sap.m.MessageBox.success(result[0].message, {
                  onClose: function(){
                    thes.onRefreshTable();
                  }
                });
              }else{
                sap.m.MessageBox.error(result[0].message);
              }
            },
            error: function(xhr,status,error){
              sap.m.MessageBox.error("Error de Conexión");
            },
            complete: function(){
              sap.ui.core.BusyIndicator.hide();
            }
          });
        }else{
          sap.m.MessageBox.warning("Por favor, seleccione una fila");
          sap.ui.core.BusyIndicator.hide();
        }
      },
      onGetSpecialties: function(){
        sap.ui.core.BusyIndicator.show(0);
        $.ajax({
          url: urlGlobal + "?ID=07",
          method: 'GET',
          success: function(result){
            especialidades = result;
          },
          error: function(){
            sap.m.MessageBox.error("Error de Conexión");
          },
          complete: function(){
            sap.ui.core.BusyIndicator.hide();
          }
        });
      },
      getFechaActual: function(){
        var fec=new Date(); 
        var dia=fec.getDate(); 
        if (dia<10) dia='0'+dia; 
        var mes=fec.getMonth() + 1; 
        if (mes<10) mes='0'+mes; 
        var anio=fec.getFullYear();
        var fecha = anio + "" + mes + "" + dia;
        return fecha;
      },
      getHoraActual: function(){          
        var now = new Date();
        var year = "" + now.getFullYear();
        var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return hour + "" + minute + "" + second;
      },
      getForHor: function(){
        var f = new Date(); 
        console.log(f.getFullYear()+((f.getMonth() +1)<10?"0"+(f.getMonth() +1):(f.getMonth() +1))+(f.getDate()<10?"0"+f.getDate():f.getDate())+(f.getHours()<10?"0"+f.getHours():f.getHours())+(f.getMinutes()<10?"0"+f.getMinutes():f.getMinutes())+(f.getSeconds()<10?"0"+f.getSeconds():f.getSeconds()));
      }
    });
});


// var cadena = event.getSource().sId;
// var num = parseInt(cadena.charAt(cadena.length-1));
// this.getView().byId("IDDETUTABLAPANSON").removeItem(num);