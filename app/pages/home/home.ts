import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
            alert("ERROR: "+ error);
        });

  }

  /**
   *
  **/
  public add_liquor(){

    let liquor_name = 'Ardbeg';
    let category_id = 1;
    this.insert_liquor (liquor_name, category_id);
  }
  /**
   *
   *
  **/
  private insert_liquor (liquor_name, category_id){

    // first check if data exists
    let query = "SELECT count(*) AS total FROM lc_liquor WHERE name='"+liquor_name+"'";

    this.database.executeSql(query, []).then((data) => {
       if(data.rows.item(0).total == 0 ){
          // if doesn't already exist, add it
          query = "INSERT INTO lc_liquor (name, category_id) VALUES ('"+liquor_name+"', '"+category_id+"')";
          this.database.executeSql(query, []).then((data) => {
                alert("Added "+liquor_name);
            }, (error) => {
                alert("ERROR insert: " + JSON.stringify(error));
            });
       } else {
          alert(liquor_name + " already exists.");
       }
    }, (error) => {
        alert("ERROR check : " + JSON.stringify(error.err));
    });
  }

  /**
   *
  **/
  public add_category(){
    let category_name = 'Whiskey';
    this.insert_category(category_name);
  }
  /**
   *
   *
  **/
  private insert_category(category_name) {


    // first check if data exists
    let query = "SELECT count(*) AS total, category_id AS catid FROM lc_category WHERE name='"+category_name+"'";

    this.database.executeSql(query, []).then((data) => {
       if(data.rows.item(0).total == 0 ){
          // if doesn't already exist, add it
          query = "INSERT INTO lc_category (name) VALUES ('"+category_name+"')";
          this.database.executeSql(query, []).then((data) => {
                alert("Added "+category_name);
            }, (error) => {
                alert("ERROR insert: " + JSON.stringify(error));
            });
       } else {
          alert(category_name + " (" + data.rows.item(0).catid +") already exists.");
       }
    }, (error) => {
        alert("ERROR check : " + JSON.stringify(error.err));
    });
  }

  public refresh() {

        this.database.executeSql("SELECT lc.name as category, ll.name as name FROM lc_liquor as ll, lc_category as lc WHERE lc.category_id=ll.category_id", []).then((data) => {
            this.liquor = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.liquor.push({name: data.rows.item(i).name, category: data.rows.item(i).category});
                }
            }
        }, (error) => {
            alert("ERROR: " + JSON.stringify(error));
        });
    }

}
