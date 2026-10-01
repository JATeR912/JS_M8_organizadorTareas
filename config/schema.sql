CREATE DATABASE organizador_tareas_db;
CREATE TABLE usuarios (
id SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
activo BOOLEAN DEFAULT true
);


INSERT INTO usuarios (nombre, email, password) VALUES
('José González', 'jose.gonzalez@mail.com', 'contrasena1234'),
('Juan Pérez', 'juan.perez@gmail.com', 'juanp2025'),
('María Martínez', 'maria.martinez@outlook.com', 'mmartinez789');


CREATE TABLE perfiles(
id SERIAL PRIMARY KEY,
avatar_url TEXT NULL,
telefono VARCHAR(20),
sobre_mi VARCHAR(255),
usuario_id INT UNIQUE NOT NULL,
CONSTRAINT perfil_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO perfiles (telefono, sobre_mi, usuario_id) VALUES
('+56912345678', 'Soy desarrollador web', 1),
('+56991234567', 'Soy profesor de ingles', 2),
('+56989123456', 'Soy ama de casa', 3);

CREATE TABLE proyectos(
id SERIAL PRIMARY KEY,
titulo VARCHAR(100) NOT NULL,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
descripcion VARCHAR(255),
imagen_url TEXT NULL,
privado BOOLEAN DEFAULT false,
usuario_id INT,
CONSTRAINT proyecto_fk FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


INSERT INTO proyectos (titulo, descripcion, usuario_id) VALUES
('Pagina web cafe', 'Desarrollo de una pagina web de cafe', 1),
('Desarrollo clases 1', 'Paso a paso de desarrollo de clases y lecciones del curso', 2),
('Panqueques', 'Receta para 12 panqueques', 3),
('Api de peliculas', 'Desarrollo de una api de peliculas', 1),
('Cortinas', 'Paso a paso de como hacer cortinas', 3);

CREATE TABLE tareas(
id SERIAL PRIMARY KEY,
nombre VARCHAR(255),
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado BOOLEAN DEFAULT false,
proyecto_id INT,
CONSTRAINT tarea_fk FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);


INSERT INTO tareas (nombre, estado, proyecto_id) VALUES
('Escoger stack del proyecto', true, 1),
('Diseñar prototipo de la carta de cafés', false, 1),
('Implementar formulario de contacto y reservas', false, 1),
('Estructurar temario del Módulo 7', true, 2),
('Redactar lección sobre conexiones con pg Client', true, 2),
('Preparar guía práctica de integración con Express', false, 2),
('Comprar harina, leche y huevos', true, 3),
('Mezclar ingredientes y dejar reposar la masa', false, 3),
('Cocinar panqueques a fuego medio y rellenar', false, 3),
('Modelar tabla de películas y directores en PostgreSQL', true, 4),
('Crear rutas GET y POST para catálogo de películas', false, 4),
('Tomar medidas del ancho y alto de la ventana', true, 5),
('Comprar tela jacquard y cinta para dobladillo', false, 5),
('Coser dobladillos y colocar ganchos para riel', false, 5);

CREATE TABLE log_avance(
id SERIAL PRIMARY KEY,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado_actual BOOLEAN DEFAULT false,
tiempo_dedicado INT DEFAULT 0,
tarea_id INT,
usuario_id INT,
CONSTRAINT tarea_usuario_fk FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
CONSTRAINT tarea_usuario_fk2 FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);



-- DATOS PARA SEQUELIZE

INSERT INTO usuarios (nombre, email, password, fecha_registro) VALUES
('José González', 'jose.gonzalez@mail.com', 'contrasena1234', NOW()),
('Juan Pérez', 'juan.perez@gmail.com', 'juanp2025', NOW()),
('María Martínez', 'maria.martinez@outlook.com', 'mmartinez789', NOW());

INSERT INTO perfiles (telefono, sobre_mi, usuario_id) VALUES
('+56912345678', 'Soy desarrollador web', 1),
('+56991234567', 'Soy profesor de ingles', 2),
('+56989123456', 'Soy ama de casa', 3);

INSERT INTO proyectos (titulo, descripcion, usuario_id, fecha_creacion) VALUES
('Pagina web cafe', 'Desarrollo de una pagina web de cafe', 1, NOW()),
('Desarrollo clases 1', 'Paso a paso de desarrollo de clases y lecciones del curso', 2, NOW()),
('Panqueques', 'Receta para 12 panqueques', 3, NOW()),
('Api de peliculas', 'Desarrollo de una api de peliculas', 1, NOW()),
('Cortinas', 'Paso a paso de como hacer cortinas', 3, NOW());

INSERT INTO tareas (nombre, estado, proyecto_id, fecha_creacion) VALUES
('Escoger stack del proyecto', true, 1, NOW()),
('Diseñar prototipo de la carta de cafés', false, 1, NOW()),
('Implementar formulario de contacto y reservas', false, 1, NOW()),
('Estructurar temario del Módulo 7', true, 2, NOW()),
('Redactar lección sobre conexiones con pg Client', true, 2, NOW()),
('Preparar guía práctica de integración con Express', false, 2, NOW()),
('Comprar harina, leche y huevos', true, 3, NOW()),
('Mezclar ingredientes y dejar reposar la masa', false, 3, NOW()),
('Cocinar panqueques a fuego medio y rellenar', false, 3, NOW()),
('Modelar tabla de películas y directores en PostgreSQL', true, 4, NOW()),
('Crear rutas GET y POST para catálogo de películas', false, 4, NOW()),
('Tomar medidas del ancho y alto de la ventana', true, 5, NOW()),
('Comprar tela jacquard y cinta para dobladillo', false, 5, NOW()),
('Coser dobladillos y colocar ganchos para riel', false, 5, NOW());