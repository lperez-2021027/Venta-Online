// Importaciones 
// Dependencias
const express = require('express');
const cors = require('cors');

// Clases
const {dbConection} = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            carritos:   '/api/compras',
            buscar:     '/api/buscar'
        }

        this.conectarDB();

        this.middlewares();

        this.routes();
    }

    async conectarDB() {
        await dbConection();
    }

    middlewares(){

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del Body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use(  express.static('public') );
    }

    routes(){
       this.app.use(this.paths.auth, require('../routes/auth'));
       this.app.use(this.paths.categorias, require('../routes/categoria'));
       this.app.use(this.paths.productos, require('../routes/producto'));
       this.app.use(this.paths.usuarios, require('../routes/usuario'));
       this.app.use(this.paths.carritos, require('../routes/carrito'));
       this.app.use(this.paths.buscar, require('../routes/buscar'));
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        } )
    }
}

module.exports = Server;