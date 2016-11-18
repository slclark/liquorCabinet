import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner, SQLite } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/add_liquor/add_liquor.html'
})
export class AddLiquorPage {

    public database: SQLite;
    public selectedValue = 1;
    public optionsList: Array<{ value: number, text: string, checked: boolean }> = [];
  
    constructor(public navCtrl: NavController) {
        this.database = new SQLite();
        
        this.database.openDatabase({name: "lc_liquor_data.db", location: "default"}).then(() => {
            this.database.executeSql("SELECT lc.category_id as catid, lc.name as name FROM lc_category as lc", []).then((data) => {
            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    let cat = data.rows.item(i).name;
                    let catid = data.rows.item(i).catid;
                    
                    this.optionsList.push({ value: catid, text: cat, checked: false });
                }
            }
        });
        }, (error) => {
            alert("ERROR: "+ error);
        });
        
    }
}
