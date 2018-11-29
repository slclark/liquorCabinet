import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SQLite } from 'ionic-native';
import { NavController,NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/add_liquor/add_liquor.html'
})
export class AddLiquorPage {

    public database: SQLite;
    public optionsList: Array<{ value: number, text: string, checked: boolean }> = [];
    public liquor_item:any;
    public itemSubmitted: boolean = false;
    public itemExists: boolean = false;
    public liquorIdParam:any;
  
    constructor(private formBuilder: FormBuilder, public navCtrl: NavController,public params:NavParams) {
       this.liquorIdParam = params.get("liquorIdPassed");
       this.database = new SQLite();
        this.database.openDatabase({name: "lc_liquor_data.db", location: "default"}).then(() => {
            this.database.executeSql("SELECT lc.category_id as catid, lc.name as name FROM lc_category as lc", []).then((data) => {
                if(data.rows.length > 0) {
                    for(let i = 0; i < data.rows.length; i++) {
                        let cat = data.rows.item(i).name;
                        let catid = data.rows.item(i).catid;
                    alert(typeof catid);
                        this.optionsList.push({ value: catid, text: cat, checked: false });
                    }
                }
            });
            
            if(this.liquorIdParam != undefined){
                let query = "SELECT name, category_id FROM lc_liquor WHERE liquor_id='"+this.liquorIdParam+"'";
                this.database.executeSql(query, []).then((data) => {
                    if(data.rows.item(0).name != undefined ){
                        this.liquor_item.value.liquor_name = data.rows.item(0).name;
                        this.liquor_item.value.category = data.rows.item(0).category_id;
                        alert(this.liquor_item.value.category);
                    }
                });
            }
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
                this.itemSubmitted = true;
                this.itemExists = false;
            }, (error) => {
                console.log("ERROR insert: " + JSON.stringify(error));
            });
       } else {
          this.itemExists = true;
          this.itemSubmitted = false;
       }
    }, (error) => {
        console.log("ERROR check : " + JSON.stringify(error.err));
    });
    
  }
  
  public checkIfChecked(id){
  alert(this.liquor_item.value.category);
    if(id == this.liquor_item.value.category){
    return true;
    }
  }
}
