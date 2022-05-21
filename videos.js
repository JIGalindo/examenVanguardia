//npm install
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://JGalindo:Galindo02@cluster0.3ylgj.mongodb.net/VideoDB?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

//Definiendo el esquema
const videoSchema = new mongoose.Schema(
  {
    titulo:String,
    descripcion: String,
    duracion: String,
    autor:String,
    enlace: String,
    fechahora:{ type: Date, default: Date.Now },
  },
  {
    collection: "Video", //para forzar a enlazar con una colección
  }
);

//paseando el esquema al modelo
const Video = mongoose.model("Video", videoSchema);


router.get("/videos", (req, res) => {
  Video.find((err, videos) => {
    if (err) res.status(500).send("Error en la base de datos1");
    else res.status(200).json(videos);
  });
});


router.get("/videos/entrefechas", function (req, res) {
  Video.find({ fechahora: { $gt: req.query.fechahora, $lte: req.query.fechahora1} }, function (err, videos) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la base de datos3");
    } else res.status(200).json(videos);
  });
});

router.get("/videos/autor", function (req, res) {
  Video.find( {autor : req.query.autor }, function (err, videos) {
    if (err) res.status(500).send("Error en la base de datos6 ");
    else {
      if (videos != null) {
        res.status(200).json(videos);
      } else res.status(404).send("No se encontro el video");
    }
  });
});

router.get("/videos/:id", function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) res.status(500).send("Error en la base de datos4 ");
    else {
      if (video != null) {
        res.status(200).json(video);
      } else res.status(404).send("No se encontro el video");
    }
  });
});



//crear nuevo vido
router.post("/videos", function (req, res) {
  const video1 = new Video({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    duracion: req.body.duracion,
    autor: req.body.autor,
    enlace: req.body.enlace,
    fechahora: req.body.fechahora
  }); 
  video1.save(function (error, video1) {
    if (error) {
      res.status(500).send("No se ha podido agregar.");
    } else {
      res.status(200).json(video1);
    }
  });
});


//eliminar un registro
router.delete("/videos/:id", function (req, res) {
  Video.findById(req.params.id, function (err, video) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (video != null) {
        video.remove(function (error, result) {
          if (error) res.status(500).send("Error en la base de datos");
          else {
            res.status(200).send("Eliminado exitosamente");
          }
        });
      } else res.status(404).send("No se encontro el video");
    }
  });
});

module.exports = router;









