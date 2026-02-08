import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Tag,
  Typography,
  Select,
  message,
  InputNumber,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BankOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useEcclesiasticalUnits,
  useCreateEcclesiasticalUnit,
  useUpdateEcclesiasticalUnit,
  useDeleteEcclesiasticalUnit,
  useEcclesiasticalUnitsStats,
} from '../lib/hooks/useEcclesiasticalUnits';
import type { EcclesiasticalUnit } from '../lib/api/ecclesiasticalUnits';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const UNIT_TYPES = [
  { value: 1, label: 'Diocèse' },
  { value: 2, label: 'Paroisse' },
  { value: 3, label: 'Chapelle' },
  { value: 4, label: 'Autre' },
];

export function EcclesiasticalUnitsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: unitsResponse, isLoading } = useEcclesiasticalUnits({
    search: searchTerm || undefined,
    code_type: typeFilter,
    page,
    limit: pageSize,
  });

  const { data: stats } = useEcclesiasticalUnitsStats();
  const createUnit = useCreateEcclesiasticalUnit();
  const updateUnit = useUpdateEcclesiasticalUnit();
  const deleteUnit = useDeleteEcclesiasticalUnit();

  // Debug: Log stats to see the actual structure
  console.log('Stats data:', stats);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<EcclesiasticalUnit | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (unit?: EcclesiasticalUnit) => {
    if (unit) {
      setEditingUnit(unit);
      form.setFieldsValue({
        libelle: unit.libelle,
        description: unit.description,
        titre: unit.titre,
        adresse: unit.adresse,
        code_type: unit.code_type,
        longitude: unit.longitude ? parseFloat(unit.longitude) : undefined,
        latitude: unit.latitude ? parseFloat(unit.latitude) : undefined,
        altitude: unit.altitude ? parseFloat(unit.altitude) : undefined,
        fidele: unit.fidele,
        date_creation_unite: unit.date_creation_unite ? dayjs(unit.date_creation_unite) : undefined,
        statut_canonique: unit.statut_canonique,
        code_unite_parent: unit.code_unite_parent,
        activite: unit.activite,
      });
    } else {
      setEditingUnit(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const unitData = {
        ...values,
        date_creation_unite: values.date_creation_unite
          ? values.date_creation_unite.format('YYYY-MM-DD')
          : undefined,
      };

      if (editingUnit) {
        await updateUnit.mutateAsync({
          id: editingUnit.code,
          data: unitData,
        });
        message.success('Unité ecclésiale modifiée avec succès');
      } else {
        await createUnit.mutateAsync(unitData);
        message.success('Unité ecclésiale créée avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (unit: EcclesiasticalUnit) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${unit.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteUnit.mutateAsync(unit.code);
          message.success('Unité ecclésiale supprimée avec succès');
        } catch (error: any) {
          message.error(
            error.response?.data?.message || 'Impossible de supprimer cette unité'
          );
        }
      },
    });
  };

  const getUnitTypeLabel = (code?: number) => {
    return UNIT_TYPES.find((t) => t.value === code)?.label || 'Non défini';
  };

  const columns: ColumnsType<EcclesiasticalUnit> = [
    {
      title: 'Nom',
      dataIndex: 'libelle',
      key: 'libelle',
      render: (libelle: string, record) => (
        <Space>
          <BankOutlined style={{ color: '#1677ff' }} />
          <div>
            <Text strong>{libelle}</Text>
            {record.titre && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.titre}
                </Text>
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'code_type',
      key: 'code_type',
      render: (code_type: number) => (
        <Tag color="blue">{getUnitTypeLabel(code_type)}</Tag>
      ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (adresse: string) => adresse || '-',
    },
    {
      title: 'Statut canonique',
      dataIndex: 'statut_canonique',
      key: 'statut_canonique',
      render: (statut: string) => statut || '-',
    },
    {
      title: 'Localisation',
      key: 'location',
      render: (_, record) => {
        if (record.latitude && record.longitude) {
          return (
            <Space size="small">
              <EnvironmentOutlined />
              <Text style={{ fontSize: 12 }}>
                {parseFloat(record.latitude).toFixed(4)}, {parseFloat(record.longitude).toFixed(4)}
              </Text>
            </Space>
          );
        }
        return '-';
      },
    },
    {
      title: 'Date création',
      dataIndex: 'date_creation',
      key: 'date_creation',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Gestion des unités ecclésiales
          </Title>
          <Text type="secondary">Gérez les diocèses, paroisses et chapelles</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouvelle unité
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total des unités"
                value={typeof stats.total === 'number' ? stats.total : 0}
                prefix={<BankOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Diocèses"
                value={typeof stats.byType === 'object' && stats.byType ? (stats.byType[1] || stats.byType['1'] || 0) : 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Paroisses"
                value={typeof stats.byType === 'object' && stats.byType ? (stats.byType[2] || stats.byType['2'] || 0) : 0}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Space style={{ width: '100%' }} direction="vertical">
        <Space>
          <Input
            size="large"
            placeholder="Rechercher..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            size="large"
            placeholder="Type d'unité"
            style={{ width: 200 }}
            allowClear
            value={typeFilter}
            onChange={setTypeFilter}
            options={UNIT_TYPES}
          />
        </Space>
      </Space>

      {/* Units Table */}
      <Table
        columns={columns}
        dataSource={unitsResponse?.data}
        rowKey="code"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: unitsResponse?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} unités`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingUnit ? "Modifier l'unité ecclésiale" : 'Nouvelle unité ecclésiale'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nom"
                name="libelle"
                rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
              >
                <Input placeholder="Diocèse de Douala" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Titre" name="titre">
                <Input placeholder="Diocèse" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Description de l'unité..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Type d'unité" name="code_type">
                <Select placeholder="Sélectionner le type" options={UNIT_TYPES} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Statut canonique" name="statut_canonique">
                <Input placeholder="Paroisse établie" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Adresse" name="adresse">
            <Input placeholder="123 Rue de l'Église, Douala, Cameroun" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  { type: 'number', min: -90, max: 90, message: 'Latitude invalide' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="4.0511" step={0.0001} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[
                  { type: 'number', min: -180, max: 180, message: 'Longitude invalide' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="9.7679" step={0.0001} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Altitude (m)" name="altitude">
                <InputNumber style={{ width: '100%' }} placeholder="750" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fidèles" name="fidele">
                <Input placeholder="5000 paroissiens enregistrés" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date de création de l'unité" name="date_creation_unite">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Unité parente" name="code_unite_parent">
            <Select
              placeholder="Sélectionner l'unité parente"
              allowClear
              showSearch
              options={unitsResponse?.data
                .filter((u) => u.code !== editingUnit?.code)
                .map((u) => ({
                  label: `${u.libelle} (${getUnitTypeLabel(u.code_type)})`,
                  value: u.code,
                }))}
            />
          </Form.Item>

          <Form.Item label="Activités" name="activite">
            <TextArea rows={2} placeholder="Messe quotidienne, Catéchisme, Ministère de la jeunesse" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createUnit.isPending || updateUnit.isPending}
              >
                {editingUnit ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
