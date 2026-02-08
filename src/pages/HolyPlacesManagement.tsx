import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Typography,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Image,
  InputNumber,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useHolyPlaces,
  useCreateHolyPlace,
  useUpdateHolyPlace,
  useDeleteHolyPlace,
  useHolyPlaceStats,
} from '../lib/hooks/useHolyPlaces';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { HolyPlace } from '../lib/api/holyPlaces';

const { Title, Text } = Typography;

export function HolyPlacesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: holyPlacesResponse, isLoading } = useHolyPlaces({
    search: searchTerm || undefined,
    code_unite_ecclesiale: unitFilter,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: stats } = useHolyPlaceStats();

  const createHolyPlace = useCreateHolyPlace();
  const updateHolyPlace = useUpdateHolyPlace();
  const deleteHolyPlace = useDeleteHolyPlace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHolyPlace, setEditingHolyPlace] = useState<HolyPlace | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (holyPlace?: HolyPlace) => {
    if (holyPlace) {
      setEditingHolyPlace(holyPlace);
      form.setFieldsValue({
        libelle: holyPlace.libelle,
        adresse: holyPlace.adresse,
        photo: holyPlace.photo,
        longitude: holyPlace.longitude ? parseFloat(holyPlace.longitude) : undefined,
        latitude: holyPlace.latitude ? parseFloat(holyPlace.latitude) : undefined,
        code_unite_ecclesiale: holyPlace.code_unite_ecclesiale,
      });
    } else {
      setEditingHolyPlace(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHolyPlace(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingHolyPlace) {
        await updateHolyPlace.mutateAsync({
          id: editingHolyPlace.code,
          data: values,
        });
        message.success('Lieu saint modifié avec succès');
      } else {
        await createHolyPlace.mutateAsync(values);
        message.success('Lieu saint créé avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (holyPlace: HolyPlace) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${holyPlace.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteHolyPlace.mutateAsync(holyPlace.code);
          message.success('Lieu saint supprimé avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer ce lieu');
        }
      },
    });
  };

  const handleViewOnMap = (latitude?: string, longitude?: string) => {
    if (latitude && longitude) {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    }
  };

  const columns: ColumnsType<HolyPlace> = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string) =>
        photo ? (
          <Image
            src={photo}
            alt="Holy place"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              background: '#f0f0f0',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CameraOutlined style={{ color: '#bfbfbf' }} />
          </div>
        ),
    },
    {
      title: 'Nom',
      dataIndex: 'libelle',
      key: 'libelle',
      render: (libelle: string) => <Text strong>{libelle}</Text>,
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
      render: (adresse: string) =>
        adresse ? (
          <Space size="small">
            <EnvironmentOutlined style={{ color: '#1677ff' }} />
            <Text>{adresse}</Text>
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: 'Coordonnées GPS',
      key: 'coordinates',
      render: (_, record) =>
        record.latitude && record.longitude ? (
          <Space direction="vertical" size="small">
            <Tag icon={<GlobalOutlined />} color="blue">
              Lat: {parseFloat(record.latitude).toFixed(4)}
            </Tag>
            <Tag icon={<GlobalOutlined />} color="green">
              Long: {parseFloat(record.longitude).toFixed(4)}
            </Tag>
            <Button
              type="link"
              size="small"
              icon={<EnvironmentOutlined />}
              onClick={() => handleViewOnMap(record.latitude, record.longitude)}
            >
              Voir sur la carte
            </Button>
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: 'Unité ecclésiale',
      key: 'unit',
      render: (_, record) => record.ecclesiasticalUnit?.libelle || '-',
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
            Lieux saints
          </Title>
          <Text type="secondary">Gérez les sanctuaires, chapelles et lieux de pèlerinage</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouveau lieu saint
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total des lieux"
                value={stats.total}
                prefix={<EnvironmentOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avec photos"
                value={stats.withPhotos}
                prefix={<CameraOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avec coordonnées GPS"
                value={stats.withCoordinates}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Space>
        <Input
          placeholder="Rechercher un lieu..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          placeholder="Unité ecclésiale"
          style={{ width: 200 }}
          allowClear
          showSearch
          value={unitFilter}
          onChange={setUnitFilter}
          options={unitsResponse?.data.map((u) => ({
            label: u.libelle,
            value: u.code,
          }))}
        />
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={holyPlacesResponse?.data}
        rowKey="code"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: holyPlacesResponse?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} lieux`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingHolyPlace ? 'Modifier le lieu saint' : 'Nouveau lieu saint'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nom"
            name="libelle"
            rules={[{ required: true, message: 'Veuillez entrer le nom du lieu' }]}
          >
            <Input placeholder="Sanctuaire de Notre-Dame de Lourdes" />
          </Form.Item>

          <Form.Item label="Adresse" name="adresse">
            <Input.TextArea
              rows={2}
              placeholder="456 Rue du Pèlerinage, Yaoundé, Cameroun"
            />
          </Form.Item>

          <Form.Item label="URL de la photo" name="photo">
            <Input placeholder="https://example.com/photos/shrine.jpg" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Latitude"
                name="latitude"
                rules={[
                  { type: 'number', min: -90, max: 90, message: 'Entre -90 et 90' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="3.848"
                  step={0.0001}
                  precision={7}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={[
                  { type: 'number', min: -180, max: 180, message: 'Entre -180 et 180' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="11.5021"
                  step={0.0001}
                  precision={7}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Unité ecclésiale" name="code_unite_ecclesiale">
            <Select
              placeholder="Sélectionner l'unité"
              showSearch
              allowClear
              options={unitsResponse?.data.map((u) => ({
                label: u.libelle,
                value: u.code,
              }))}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createHolyPlace.isPending || updateHolyPlace.isPending}
              >
                {editingHolyPlace ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
