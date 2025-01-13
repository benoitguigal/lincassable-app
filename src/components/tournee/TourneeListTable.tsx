import {
  Collecte,
  CollecteWithPointDeCollecte,
  Identity,
  PointDeCollecte,
  StatutTourneeEnum,
  Tournee,
  Transporteur,
  TypeDeVehiculeEnum,
  ZoneDeCollecte,
} from "../../types";
import {
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  useTable,
  FilterDropdown,
  useSelect,
} from "@refinedev/antd";
import { CanAccess } from "@refinedev/core";
import { Select, Space, Table, DatePicker } from "antd";
import CollecteEditButton from "../collecte/CollecteEditButton";
import CollecteCreateButton from "../collecte/CollecteCreateButton";
import dayjs from "dayjs";
import TourneeMailButton from "./TourneeMailButton";
import TourneeStatutTag from "./TourneeStatutTag";
import BonDeTourneeUpload from "./BonDeTourneeUpload";
import { typeDeVehiculeOptions } from "../../utility/options";

const { RangePicker } = DatePicker;

type TourneeListTableProps = {
  user: Identity;
};

type Record = Tournee & {
  collecte: (Collecte & { point_de_collecte: PointDeCollecte })[];
  transporteur: Transporteur;
  zone_de_collecte: ZoneDeCollecte;
};

export type TourneeWithCollectes = Tournee & {
  collectes: CollecteWithPointDeCollecte[];
};

const minDate = "2020-01-01";
const maxDate = "2099-01-01";

const TourneeListTable: React.FC<TourneeListTableProps> = ({ user }) => {
  const isTransporteur = user.appRole === "transporteur";

  const { tableProps } = useTable<Record>({
    syncWithLocation: true,
    pagination: { mode: "server" },
    sorters: { permanent: [{ field: "date", order: "desc" }] },
    filters: {
      mode: "server",
      initial: [
        {
          field: "date",
          value: [minDate, maxDate],
          operator: "between",
        },
      ],
      ...(isTransporteur
        ? {
            permanent: [
              {
                field: "transporteur_id",
                operator: "eq",
                value: user.transporteurId,
              },
            ],
          }
        : {}),
    },
    meta: {
      select:
        "*, collecte(*,point_de_collecte(nom)),transporteur(nom),zone_de_collecte(nom)",
    },
  });

  const { selectProps: transporteurSelectProps } = useSelect<Transporteur>({
    resource: "transporteur",
    optionLabel: "nom",
    optionValue: "id",
    ...(user.transporteurId
      ? {
          filters: [
            { field: "id", operator: "eq", value: user.transporteurId },
          ],
        }
      : {}),
  });

  return (
    <Table {...tableProps} size="small" rowKey="id">
      <Table.Column
        dataIndex={["date"]}
        title="Date"
        render={(value: any) => (
          <DateField value={value} format="ddd DD MMM YY" locales="fr" />
        )}
        // defaultFilteredValue={getDefaultFilter("date", filters, "between")}
        filterDropdown={(props) => (
          <FilterDropdown
            {...props}
            mapValue={(selectedKeys, event) => {
              if (!selectedKeys) {
                return selectedKeys;
              }

              if (event === "value") {
                return selectedKeys.map((key) => {
                  if (typeof key === "string") {
                    if (key === minDate || key === maxDate) {
                      return null;
                    }
                    return dayjs(key);
                  }

                  return key;
                });
              }

              if (event === "onChange") {
                return selectedKeys.map((key, idx) => {
                  if (!key) {
                    return idx === 0 ? minDate : maxDate;
                  }
                  return dayjs.isDayjs(key) ? key.format("YYYY-MM-DD") : key;
                });
              }

              return selectedKeys;
            }}
          >
            <RangePicker
              allowEmpty={true}
              allowClear={true}
              presets={[
                { label: "Passées", value: [null, dayjs()] },
                { label: "À venir", value: [dayjs(), null] },
              ]}
            />
          </FilterDropdown>
        )}
      />
      <Table.Column
        dataIndex="zone_de_collecte"
        title="Zone de collecte"
        render={(zoneDeCollecte: ZoneDeCollecte) => {
          return zoneDeCollecte.nom ?? "";
        }}
      />
      <Table.Column
        dataIndex="statut"
        title="Statut"
        render={(value: StatutTourneeEnum) => (
          <TourneeStatutTag value={value} />
        )}
      />
      <Table.Column<Record>
        dataIndex="transporteur"
        title="Transporteur"
        render={(transporteur: Transporteur) => {
          return transporteur.nom;
        }}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              {...transporteurSelectProps}
              style={{ width: "200px" }}
              allowClear
              placeholder="Transporteur"
            />
          </FilterDropdown>
        )}
      />
      <Table.Column<Record>
        dataIndex="collecte"
        title="Collectes"
        width={400}
        render={(collectes: Record["collecte"], record) => {
          const collectesBtn = collectes.map((collecte) => (
            <CollecteEditButton collecte={collecte} />
          ));
          const addCollecte = (
            <CollecteCreateButton tournee_id={record.id as number} />
          );
          return <Space wrap>{[...collectesBtn, addCollecte]}</Space>;
        }}
      />

      <Table.Column<Record>
        dataIndex="bon_de_tournee"
        title="Bon de tournée complété"
        render={(_, record) => {
          return (
            <div style={{ maxWidth: "150px" }}>
              <BonDeTourneeUpload
                tournee={record}
                zoneDeCollecte={record.zone_de_collecte}
              />
            </div>
          );
        }}
      ></Table.Column>
      <Table.Column
        dataIndex="type_de_vehicule"
        title="Type de véhicule"
        render={(type: TypeDeVehiculeEnum) => {
          return (
            typeDeVehiculeOptions.find((option) => option.value === type)
              ?.label ?? ""
          );
        }}
      />
      <Table.Column
        dataIndex="prix"
        title="Prix"
        render={(prix: number) => {
          return prix ? `${prix} €` : "";
        }}
      />
      <Table.Column<Record>
        title="Actions"
        dataIndex="actions"
        render={(_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} />
            <CanAccess resource="tournee" action="send_mail">
              <TourneeMailButton
                tournee={record}
                zoneDeCollecte={record.zone_de_collecte}
              />
            </CanAccess>
          </Space>
        )}
      />
    </Table>
  );
};

export default TourneeListTable;
