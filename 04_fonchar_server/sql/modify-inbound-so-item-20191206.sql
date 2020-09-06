use db_cc;

ALTER table tb_inbound_so_item add pre_total_carton  int(11) default 0;
ALTER table tb_inbound_so_item add pre_total_cbm float default 0.00;
ALTER table tb_inbound_so_item add pre_total_pcs int(11) default 0;
ALTER table tb_inbound_so_item add pre_total_weight float default 0.00;


ALTER table tb_inbound_so add lig_push_state tinyint(4) default 0;
ALTER table tb_shipment add lig_push_state tinyint(4) default 0;


ALTER table tb_inbound_so_item add by_ship_date date;
ALTER table tb_inbound_so add by_ship_date date;

ALTER table tb_inbound_so_item add wms_total_cbm_veritable float default 0.00;
ALTER table tb_inbound_so_item add wms_total_weight_veritable float default 0.00;


ALTER table tb_shipment_item add wms_shipment_carton int(11) default 0;
ALTER table tb_shipment_item add wms_shipment_pcs int(11) default 0;


ALTER table tb_shipment_item drop wms_shipment_carton;
ALTER table tb_shipment_item drop wms_shipment_pcs;

ALTER table tb_shipment_item add total_carton int(11) default 0;
ALTER table tb_shipment_item add total_pcs int(11) default 0;


ALTER table tb_shipment_item drop total_carton;
ALTER table tb_shipment_item drop total_pcs;

ALTER table tb_shipment_item add total_carton int(11) default 0 AFTER shipment_item_no;
ALTER table tb_shipment_item add total_pcs int(11) default 0 AFTER total_carton;

ALTER table tb_shipment_item modify column total_carton int(11) default 0 comment 'WMS 出仓的shipment item carton';
ALTER table tb_shipment_item modify column total_pcs int(11) default 0 comment 'WMS 出仓的shipment item pcs';


ALTER table tb_inbound_so_item modify wms_total_cbm_veritable float default 0.00 comment 'WMS 入仓的shipment item 实收 cbm';
ALTER table tb_inbound_so_item modify wms_total_weight_veritable float default 0.00 comment 'WMS 入仓的shipment item 实收 weight';