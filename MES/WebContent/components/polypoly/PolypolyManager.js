"use strict";
jQuery.sap.declare("airbus.mes.polypoly.PolypolyManager")

airbus.mes.polypolyPolypolyManager = {
		userComptencyContext : {
			rowBindingContext : undefined,
			columnIndex : undefined
		},
		
		createTableData : function(oMiiData) {
			var oMiiData = sap.ui.getCore().getModel("mii").oData;
			var oMiiRows = oMiiData.Rowsets.Rowset[0].Row;
			var oMiiColumns = oMiiData.Rowsets.Rowset[1].Row;
			
			//Creation de la table des ressourcePools
			var ressourcePools = [];
			oMiiRows.forEach(function(row){
				if(row!=""){
					if(!ressourcePools.includes(row.RP)){ressourcePools.push(row.RP)}
				}
			});
			var oTableRows = {
					rows : [
					        {"ressourcepool": "allRP", "category": "NEED", "icon": "images/3.PNG", "type": "NEED"},
					        {"ressourcepool": "allRP", "category": "NEED", "icon": "images/4.PNG", "type": "NEED"},
					],
					columns : [
					        {"type": "ressourcepool", "name" : ""},
							{"type": "category", "name" : ""},
							{"type": "icon", "name" : ""},
					]
			};
			
			//Creation des colonnes
			var colonnes = {};
			oMiiColumns.forEach(function(col){
				if(col!=""){
					oTableRows.rows[0][col.technicalName] = col.POLYPOLY_NEEDS_3;
					oTableRows.rows[1][col.technicalName] = col.POLYPOLY_NEEDS_4;
					oTableRows.columns.push({});
					oTableRows.columns[oTableRows.columns.length - 1]["name"] = col.technicalName;
					oTableRows.columns[oTableRows.columns.length - 1]["qa"] = [];
					oTableRows.columns[oTableRows.columns.length - 1]["type"] = "column";
					var qa = col.qualityApproval;
					if(qa != undefined){qa = qa.split(", ")};
					qa.forEach(function(c, i){
						if(c!=""){
							oTableRows.columns[oTableRows.columns.length - 1]["qa"].push({});
							oTableRows.columns[oTableRows.columns.length - 1]["qa"][oTableRows.columns[oTableRows.columns.length - 1]["qa"].length - 1]["label"] = c;
						}
					})
					colonnes[col.technicalName] = [0,0,0,0,parseInt(col.POLYPOLY_NEEDS_3, 10),parseInt(col.POLYPOLY_NEEDS_4, 10)];
				}
			});
			
			ressourcePools.forEach(function(rp) {
				oTableRows.rows[0]["ressourcepool"] = oTableRows.rows[0]["ressourcepool"] + "," + rp;
				oTableRows.rows[1]["ressourcepool"] = oTableRows.rows[0]["ressourcepool"];
				//Creation des lignes de type UA
				oMiiRows.forEach(function(row){
					if((row!="") && (row.RP === rp)){
						if(!ressourcePools.includes(row.RP)){ressourcePools.push()}
						oTableRows.rows.push({});
						oTableRows.rows[oTableRows.rows.length - 1]["category"] = row.longName;
						oTableRows.rows[oTableRows.rows.length - 1]["ressourcepool"] = row.RP;
						oTableRows.rows[oTableRows.rows.length - 1]["icon"] = row.status;
						if(row.status != "No_Clocked_In"){oTableRows.rows[oTableRows.rows.length - 1]["type"] = "UA_A"}
						else{oTableRows.rows[oTableRows.rows.length - 1]["type"] = "UA_P"};
						var compName = row.competency;
						var compLevel = row.level;
						if(compLevel != undefined){compLevel = compLevel.split(", ")};
						if(compName != undefined){compName = compName.split(", ")};
						compName.forEach(function(c, i){
							if(c!=""){
								oTableRows.rows[oTableRows.rows.length - 1][c] = "images/" + compLevel[i] + ".PNG";
								if(colonnes[c] != undefined){colonnes[c][parseInt(compLevel[i], 10)-1]++};
							}
						})
					}
				});
				// AS IS
				for(var i = 1; i < 5; i++){
					oTableRows.rows.push({});
					oTableRows.rows[oTableRows.rows.length - 1]["category"] = "AS IS";
					oTableRows.rows[oTableRows.rows.length - 1]["icon"] = "images/" + i.toString() + ".PNG";
					oTableRows.rows[oTableRows.rows.length - 1]["type"] = "ASIS";
					oMiiColumns.forEach(function(col){
						if(col!=""){
							var c = col.technicalName;
							oTableRows.rows[oTableRows.rows.length - 1][c] = colonnes[c][i-1].toString();
						}
					});
				}
				// Gap
				for(var j = 1; j < 3; j++){
					var k = j + 2;
					oTableRows.rows.push({});
					oTableRows.rows[oTableRows.rows.length - 1]["category"] = "GAP";
					oTableRows.rows[oTableRows.rows.length - 1]["icon"] = "images/" + k.toString() + ".PNG";
					oTableRows.rows[oTableRows.rows.length - 1]["type"] = "GAP";
					oMiiColumns.forEach(function(col){
						if(col!=""){
							var c = col.technicalName;
							var u = (colonnes[c][j+1] - colonnes[c][j+3]);
							oTableRows.rows[oTableRows.rows.length - 1][c] = u.toString();
						}
					});
				}
				// Separateur
				oTableRows.rows.push({});
			})
			return oTableRows;
		},
};