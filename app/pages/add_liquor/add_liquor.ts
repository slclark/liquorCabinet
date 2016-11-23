import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SQLite } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/add_liquor/add_liquor.html'
})
export class AddLiquorPage {

    public database: SQLite;
    public optionsList: Array<{ value: number, text: string, checked: boolean }> = [];
    public liquor_item:any;
  
    constructor(private formBuilder: FormBuilder) {
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
    ionViewLoaded() {
        this.liquor_item = this.formBuilder.group({
            liquor_name: ['', Validators.required],
            category: ['', Validators.required],
        });
    }

    /*
    *
  **/
  public add_liquor(){

    let liquor_name = this.liquor_item.value.liquor_name;
    
    let category_id = this.liquor_item.value.category;
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
    
  }
}
