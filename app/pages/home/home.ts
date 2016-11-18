import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner, SQLite } from 'ionic-native';
import { LiquorListModel } from '../../models/liquor-list-model';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    public database: SQLite;
    public liquor = [];

    constructor(public navCtrl: NavController) {

        this.database = new SQLite();

        this.database.openDatabase({name: "lc_liquor_data.db", location: "default"}).then(() => {
            this.refresh();
        }, (error) => {
            console.log("ERROR: "+ error);
        });

  }

  /**
   *
  **/
  public add_liquor(){

    let liquor_name = 'Lagavulin';
    let category_id = 7;
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
                
            }, (error) => {
                console.log("ERROR insert: " + JSON.stringify(error));
            });
       } else {
          alert(liquor_name + " already exists.");
       }
    }, (error) => {
        console.log("ERROR check : " + JSON.stringify(error.err));
    });
    
    this.refresh();
  }

  public refresh() {

        this.database.executeSql("SELECT lc.name as category, ll.name as name FROM lc_liquor as ll, lc_category as lc WHERE lc.category_id=ll.category_id", []).then((data) => {

            if(data.rows.length > 0) {
                for(let i = 0; i < data.rows.length; i++) {
                    let cat = data.rows.item(i).category;
                    let name = data.rows.item(i).name;
                    let cat_index = this.categoryExists(cat);
                    if(cat_index == -1){
                      let item = new LiquorListModel(cat);
                      item.addItem(data.rows.item(i).name);
                      this.liquor.push(item);
                    } else{
                        // verify this liquor isn't already in the list
                        let f_liquor_exists = false;                       for(let i = 0; i < this.liquor[cat_index].items.length; i++) {
                            if(this.liquor[cat_index].items[i] == name){
                                f_liquor_exists = true;
                            }
                        }
                        if(f_liquor_exists == false){
                            this.liquor[cat_index].addItem(data.rows.item(i).name);
                        }
                    }
                }
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

    private categoryExists(cat){

      for(let i = 0; i < this.liquor.length; i++) {
 
        if (this.liquor[i].name == cat){

            return i;
        }
      }
      return -1;
    }

}
