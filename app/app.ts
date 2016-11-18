import { Component } from '@angular/core';
import { Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar, SQLite } from 'ionic-native';
import { TabsPage } from './pages/tabs/tabs';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  public rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

       let db = new SQLite();


       db.openDatabase({
                name: "lc_liquor_data.db",
                location: "default"
            }).then(() => {
                /* create liquor db */
                db.executeSql("CREATE TABLE IF NOT EXISTS lc_liquor (liquor_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category_id INTEGER)", {
                }).then((data) => {
                    console.log("TABLE CREATED: "+ JSON.stringify(data));
                }, (error) => {
                    console.error("Unable to execute sql"+ JSON.stringify(error));
                });

                /* create categories db */
                db.executeSql("CREATE TABLE IF NOT EXISTS lc_category (category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", {
                }).then((data) => {
                    console.log("TABLE CREATED: "+ JSON.stringify(data));
                    let categories = [ 'Brandy','Gin', 'Liqueur', 'Rum', 'Tequila', 'Vodka','Whiskey'];
                    for(let i=0; i<categories.length;i++){
                        // first check if data exists
                        let query = "SELECT count(*) AS total, category_id AS catid FROM lc_category WHERE name='"+categories[i]+"'";

                        db.executeSql(query, []).then((data) => {
                            if(data.rows.item(0).total == 0 ){
                                // if doesn't already exist, add it
                                query = "INSERT INTO lc_category (name) VALUES ('"+categories[i]+"')";
                                db.executeSql(query, []).then((data) => {
                                }, (error) => {
                                    console.log("ERROR insert: " + JSON.stringify(error));
                                });
                            }
                        }, (error) => {
                            console.log("ERROR check : " + JSON.stringify(error.err));
                        });
                    }
                    
                }, (error) => {
                    console.error("Unable to execute sql"+ JSON.stringify(error));
                });

                /* create picture db */
                db.executeSql("CREATE TABLE IF NOT EXISTS lc_picture (picture_id INTEGER PRIMARY KEY AUTOINCREMENT, liquor_id INTEGER)", {
                }).then((data) => {
                    console.log("TABLE CREATED: "+ JSON.stringify(data));
                }, (error) => {
                    console.error("Unable to execute sql"+ JSON.stringify(error));
                });


                /* create shopping list db */
                db.executeSql("CREATE TABLE IF NOT EXISTS lc_shopping (item_id INTEGER PRIMARY KEY AUTOINCREMENT, liquor_id INTEGER, flag_needed BOOLEAN DEFAULT TRUE)", {
                }).then((data) => {
                    console.log("TABLE CREATED: "+ JSON.stringify(data));
                }, (error) => {
                    console.error("Unable to execute sql"+ JSON.stringify(error));
                });

            }, (error) => {
                console.error("Unable to open database"+ JSON.stringify(error));
            });
    });
  }
}

ionicBootstrap(MyApp);
