import fs from "fs/promises";
class ProductManager{
    constructor(path){
        this.products=[];
        this.path=path;
    }
    addProduct= async(title,description,price,thumbnail,code,stock)=>{   
        try{
            const file=await fs.readFile(this.path,'utf-8');
            this.products=JSON.parse(file);
            console.log("Tiene "+this.products.length);
            const newProduct={
                id:(this.products.length)+1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            if(!this.checkProduct(newProduct)){
                return ("There is at least an empty attribute at the product.");
            }
        
            const productAlreadyExists=this.products.find(prod=>prod.code==newProduct.code);
            if(productAlreadyExists){
                return console.log("The product is already at the list.");
            }
            this.products.push(newProduct);
            
            await fs.writeFile(this.path,JSON.stringify(this.products));
        }catch(e){
            console.log(e);
            await fs.writeFile(this.path,JSON.stringify([]));
            return [];
        }
    }
    checkProduct(product) {
        return (Object.values(product).every(valor => Boolean(valor)));
    }
    getProducts= async()=>{
        try{
            const file=await fs.readFile(this.path,'utf-8');
            this.products=JSON.parse(file);
            return this.products;
        }catch(e){
            console.error(e);
            await fs.writeFile(this.path,JSON.stringify([]));
            return [];
        }
    }
    getProductById=async(id)=>{
       try{
            const file=await fs.readFile(this.path,'utf-8');
            this.products=JSON.parse(file);
            const prod=this.products.find(product=>product.id==id);
            return (prod) ?  prod  : console.log("Not found");
       }catch(e){
            console.error(e);
       }
    }
    updateProduct= async(id,updatedProduct)=>{
       try{
            if(this.checkProduct(updatedProduct)){
                const file=await fs.readFile(this.path,'utf-8');
                this.products=JSON.parse(file);
                this.deleteProduct(id);
                this.products.splice((id-1),0,updatedProduct);  
                await fs.writeFile(this.path,JSON.stringify(this.products));
            }
       }catch(e){
            console.error(e);
       }
    }
    deleteProduct=async (id)=>{
        try{
            const file=await fs.readFile(this.path,'utf-8');
            this.products=JSON.parse(file);
            if(this.getProductById(id)){
                this.products.splice((id-1),1);
                await fs.writeFile(this.path,JSON.stringify(this.products));
            }else{
                console.log("Can't delete product,not found");
            }
        }catch(e){
            console.error(e);
        }
    }
}

let manager= new ProductManager('products.json');
console.log(await manager.getProducts());
// await manager.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25);
// console.log(manager.getProducts());
// console.log(manager.getProductById(1));
// console.log(manager.getProductById(2));
// let newProduct=manager.getProductById(1);
// newProduct.price=400;
// manager.updateProduct(newProduct.id,newProduct);
// console.log(manager.getProducts());
// manager.deleteProduct(1);
// await manager.addProduct("Nuevo Producto","Este es un producto prueba",200,"Sin imagen","asd",25);
// console.log(manager.getProducts());
// console.log(manager.getProducts());
export {ProductManager};