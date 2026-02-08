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
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CameraOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useSacredObjects,
  useCreateSacredObject,
  useUpdateSacredObject,
  useDeleteSacredObject,
  useSacredObjectStats,
} from '../lib/hooks/useSacredObjects';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { SacredObject } from '../lib/api/sacredObjects';

const { Title, Text, Paragraph } = Typography;

export function SacredObjectsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: sacredObjectsResponse, isLoading } = useSacredObjects({
    search: searchTerm || undefined,
    code_unite_ecclesiale: unitFilter,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: stats } = useSacredObjectStats();

  const createSacredObject = useCreateSacredObject();
  const updateSacredObject = useUpdateSacredObject();
  const deleteSacredObject = useDeleteSacredObject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSacredObject, setEditingSacredObject] = useState<SacredObject | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (sacredObject?: SacredObject) => {
    if (sacredObject) {
      setEditingSacredObject(sacredObject);
      form.setFieldsValue({
        libelle: sacredObject.libelle,
        description: sacredObject.description,
        photo: sacredObject.photo,
        code_unite_ecclesiale: sacredObject.code_unite_ecclesiale,
      });
    } else {
      setEditingSacredObject(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSacredObject(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingSacredObject) {
        await updateSacredObject.mutateAsync({
          id: editingSacredObject.code,
          data: values,
        });
        message.success('Objet sacré modifié avec succès');
      } else {
        await createSacredObject.mutateAsync(values);
        message.success('Objet sacré créé avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (sacredObject: SacredObject) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${sacredObject.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteSacredObject.mutateAsync(sacredObject.code);
          message.success('Objet sacré supprimé avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cet objet');
        }
      },
    });
  };

  const columns: ColumnsType<SacredObject> = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string) =>
        photo ? (
          <Image
            src={photo}
            alt="Sacred object"
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) =>
        description ? (
          <Tooltip title={description}>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0, maxWidth: 300 }}
            >
              {description}
            </Paragraph>
          </Tooltip>
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
            Objets sacrés
          </Title>
          <Text type="secondary">
            Gérez l'inventaire des vases liturgiques, vêtements et objets sacrés
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouvel objet sacré
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Total des objets"
                value={stats.total}
                prefix={<InboxOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="Unités avec inventaire"
                value={Object.keys(stats.byUnit).length}
                prefix={<InboxOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Space>
        <Input
          placeholder="Rechercher un objet..."
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
        dataSource={sacredObjectsResponse?.data}
        rowKey="code"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: sacredObjectsResponse?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} objets`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingSacredObject ? "Modifier l'objet sacré" : 'Nouvel objet sacré'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Nom"
            name="libelle"
            rules={[{ required: true, message: "Veuillez entrer le nom de l'objet" }]}
          >
            <Input placeholder="Ostensoir de Saint Pierre" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Un magnifique ostensoir doré utilisé pour l'adoration eucharistique, datant de 1850"
            />
          </Form.Item>

          <Form.Item label="URL de la photo" name="photo">
            <Input placeholder="https://example.com/photos/monstrance.jpg" />
          </Form.Item>

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
                loading={createSacredObject.isPending || updateSacredObject.isPending}
              >
                {editingSacredObject ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
