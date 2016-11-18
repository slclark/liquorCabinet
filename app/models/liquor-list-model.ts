export class LiquorListModel {
    public name = '';
    public items = [];
    constructor(public category: string){
    alert('adding '+ category);
        this.name = category;
    }

    addItem(item){
    alert('adding '+ item);
      this.items.push(item);
    }

    removeItem(item){

        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items.splice(i, 1);
            }
        }

    }
    renameItem(item, category){
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items[i].category = category;
            }
        }
    }

    setCategory(category){
        this.category = category;
    }
}
