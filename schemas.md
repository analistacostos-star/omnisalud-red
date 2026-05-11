create table omn_core_global.core_ciudades_nacional
(
    id     int auto_increment
        primary key,
    nombre varchar(100) not null,
    constraint uq_ciudad_nombre
        unique (nombre)
)
    charset = utf8mb4;

create table omn_core_global.core_servicios_nacional
(
    id              int auto_increment
        primary key,
    servicio_codigo varchar(20)                 not null,
    ciudad_id       int                         not null,
    precio_venta    decimal(12, 2)              not null,
    costo_red       decimal(12, 2) default 0.00 not null,
    active          tinyint(1)     default 1    not null comment '"0" is deactivated "1" is activated',
    constraint uq_serv_ciudad
        unique (servicio_codigo, ciudad_id)
)
    charset = utf8mb4;

create index fk_sr_ciudad
    on omn_core_global.core_servicios_nacional (ciudad_id);

create table omn_core_global.core_servicios_sedes_propias
(
    codigo       varchar(20)                 not null
        primary key,
    nombre       varchar(255)                not null,
    precio_pymes decimal(12, 2) default 0.00 not null,
    costo_base   decimal(12, 2) default 0.00 not null
)
    charset = utf8mb4;

