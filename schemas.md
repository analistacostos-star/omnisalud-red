create table omn_core_global.core_ciudades_nacional
(
    id          int auto_increment
        primary key,
    nombre      varchar(100) not null,
    proveedores text         null,
    regionales  varchar(100) null,
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
    costo_red_2025  decimal(15, 2)              null,
    costo_proveedor decimal(15, 2)              null,
    active          tinyint(1)     default 1    not null,
    is_manual       tinyint(1)     default 0    null,
    constraint uq_serv_ciudad
        unique (servicio_codigo, ciudad_id)
)
    charset = utf8mb4;

create index fk_sr_ciudad
    on omn_core_global.core_servicios_nacional (ciudad_id);

create table omn_core_global.core_servicios_sedes_propias
(
    codigo            varchar(20)                 not null
        primary key,
    nombre            varchar(255)                not null,
    precio_pymes      decimal(12, 2) default 0.00 not null,
    precio_particular decimal(12, 2) default 0.00 null,
    costo_base        decimal(12, 2) default 0.00 not null
)
    charset = utf8mb4;

