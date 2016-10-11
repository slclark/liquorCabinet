import { Component } from '@angular/core';
import { Alert, NavController } from 'ionic-angular';
import { BarcodeScanner, SQLite } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

    public database: SQLite;
    public liquor: Array<Object>;

  constructor(public navCtrl: NavController) {
        this.database = new SQLite();

        this.database.openDatabase({name: "lc_liquor_data.db", location: "default"}).then(() => {
            this.refresh();
        }, (error) => {
            console.log("ERROR: ", error);
        });

  }

public add() {
        this.database.executeSql("INSERT INTO lc_liquor (name, category) VALUES ('The Botanist', 1)", []).then((data) => {
            console.log("INSERTED: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
        });
    }
  public refresh() {

        this.database.executeSql("SELECT * FROM lc_liquor", []).then((data) => {
            this.liquor = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.liquor.push({name: data.rows.item(i).name, category: data.rows.item(i).category});
                }
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

}
