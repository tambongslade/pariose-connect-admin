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
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  NotificationOutlined,
  CalendarOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useAnnouncementStats,
  useAnnouncementTypes,
  useCreateAnnouncementType,
  useUpdateAnnouncementType,
  useDeleteAnnouncementType,
} from '../lib/hooks/useAnnouncements';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { Announcement, AnnouncementType } from '../lib/api/announcements';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export function AnnouncementsManagement() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [activeOnly, setActiveOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: announcementsResponse, isLoading } = useAnnouncements({
    search: searchTerm || undefined,
    code_type: typeFilter,
    code_unite_ecclesiale: unitFilter,
    active_only: activeOnly,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: announcementTypes } = useAnnouncementTypes();
  const { data: stats } = useAnnouncementStats();

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const createType = useCreateAnnouncementType();
  const updateType = useUpdateAnnouncementType();
  const deleteType = useDeleteAnnouncementType();

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingType, setEditingType] = useState<AnnouncementType | null>(null);
  const [announcementForm] = Form.useForm();
  const [typeForm] = Form.useForm();

  const isActive = (announcement: Announcement) => {
    if (!announcement.date_expiration) return true;
    return new Date(announcement.date_expiration) > new Date();
  };

  // Announcement handlers
  const handleOpenAnnouncementModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      announcementForm.setFieldsValue({
        libelle: announcement.libelle,
        contenu: announcement.contenu,
        code_type: announcement.code_type,
        code_unite_ecclesiale: announcement.code_unite_ecclesiale,
        date_publication: announcement.date_publication ? dayjs(announcement.date_publication) : undefined,
        date_expiration: announcement.date_expiration ? dayjs(announcement.date_expiration) : undefined,
      });
    } else {
      setEditingAnnouncement(null);
      announcementForm.resetFields();
    }
    setIsAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
    setEditingAnnouncement(null);
    announcementForm.resetFields();
  };

  const handleSubmitAnnouncement = async (values: any) => {
    try {
      const announcementData = {
        ...values,
        date_publication: values.date_publication ? values.date_publication.format('YYYY-MM-DD') : undefined,
        date_expiration: values.date_expiration ? values.date_expiration.format('YYYY-MM-DD') : undefined,
      };

      if (editingAnnouncement) {
        await updateAnnouncement.mutateAsync({
          id: editingAnnouncement.code,
          data: announcementData,
        });
        message.success('Annonce modifiée avec succès');
      } else {
        await createAnnouncement.mutateAsync(announcementData);
        message.success('Annonce créée avec succès');
      }
      handleCloseAnnouncementModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${announcement.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteAnnouncement.mutateAsync(announcement.code);
          message.success('Annonce supprimée avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cette annonce');
        }
      },
    });
  };

  // Announcement Type handlers
  const handleOpenTypeModal = (type?: AnnouncementType) => {
    if (type) {
      setEditingType(type);
      typeForm.setFieldsValue({
        libelle: type.libelle,
        description: type.description,
      });
    } else {
      setEditingType(null);
      typeForm.resetFields();
    }
    setIsTypeModalOpen(true);
  };

  const handleCloseTypeModal = () => {
    setIsTypeModalOpen(false);
    setEditingType(null);
    typeForm.resetFields();
  };

  const handleSubmitType = async (values: any) => {
    try {
      if (editingType) {
        await updateType.mutateAsync({
          id: editingType.code,
          data: values,
        });
        message.success("Type d'annonce modifié avec succès");
      } else {
        await createType.mutateAsync(values);
        message.success("Type d'annonce créé avec succès");
      }
      handleCloseTypeModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteType = (type: AnnouncementType) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${type.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteType.mutateAsync(type.code);
          message.success('Type supprimé avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer ce type');
        }
      },
    });
  };

  const announcementColumns: ColumnsType<Announcement> = [
    {
      title: 'Titre',
      dataIndex: 'libelle',
      key: 'libelle',
      render: (libelle: string, record) => (
        <Space>
          <NotificationOutlined style={{ color: isActive(record) ? '#1677ff' : '#999' }} />
          <div>
            <Text strong>{libelle}</Text>
            {!isActive(record) && (
              <div>
                <Tag color="default" style={{ marginTop: 4 }}>
                  Expirée
                </Tag>
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Contenu',
      dataIndex: 'contenu',
      key: 'contenu',
      render: (contenu: string) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: false }}
          style={{ marginBottom: 0, maxWidth: 300 }}
        >
          {contenu || '-'}
        </Paragraph>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => record.announcementType?.libelle || '-',
    },
    {
      title: 'Unité ecclésiale',
      key: 'unit',
      render: (_, record) => record.ecclesiasticalUnit?.libelle || '-',
    },
    {
      title: 'Publication',
      dataIndex: 'date_publication',
      key: 'date_publication',
      render: (date: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Expiration',
      dataIndex: 'date_expiration',
      key: 'date_expiration',
      render: (date: string) => date ? new Date(date).toLocaleDateString('fr-FR') : 'Aucune',
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record) => (
        isActive(record) ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="default" text="Expirée" />
        )
      ),
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
            onClick={() => handleOpenAnnouncementModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAnnouncement(record)}
          />
        </Space>
      ),
    },
  ];

  const typeColumns: ColumnsType<AnnouncementType> = [
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
      render: (description: string) => description || '-',
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
            onClick={() => handleOpenTypeModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteType(record)}
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
            Gestion des annonces
          </Title>
          <Text type="secondary">Gérez les annonces paroissiales</Text>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total"
                value={stats.total}
                prefix={<BellOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Actives"
                value={stats.active}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Expirées"
                value={stats.expired}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Types"
                value={Object.keys(stats.byType || {}).length}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'announcements',
            label: 'Annonces',
            children: (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center justify-between">
                  <Space>
                    <Input
                      placeholder="Rechercher..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 250 }}
                    />
                    <Select
                      placeholder="Type"
                      style={{ width: 180 }}
                      allowClear
                      showSearch
                      value={typeFilter}
                      onChange={setTypeFilter}
                      options={announcementTypes?.map((t) => ({ label: t.libelle, value: t.code }))}
                    />
                    <Select
                      placeholder="Unité"
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
                    <Select
                      placeholder="Toutes"
                      style={{ width: 150 }}
                      value={activeOnly}
                      onChange={setActiveOnly}
                      options={[
                        { label: 'Toutes', value: false },
                        { label: 'Actives seulement', value: true },
                      ]}
                    />
                  </Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenAnnouncementModal()}
                  >
                    Nouvelle annonce
                  </Button>
                </div>

                {/* Table */}
                <Table
                  columns={announcementColumns}
                  dataSource={announcementsResponse?.data}
                  rowKey="code"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize,
                    total: announcementsResponse?.meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} annonces`,
                    onChange: (newPage, newPageSize) => {
                      setPage(newPage);
                      setPageSize(newPageSize);
                    },
                  }}
                />
              </div>
            ),
          },
          {
            key: 'types',
            label: "Types d'annonces",
            children: (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenTypeModal()}
                  >
                    Nouveau type
                  </Button>
                </div>

                <Table
                  columns={typeColumns}
                  dataSource={announcementTypes}
                  rowKey="code"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} types`,
                  }}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Announcement Modal */}
      <Modal
        title={editingAnnouncement ? "Modifier l'annonce" : 'Nouvelle annonce'}
        open={isAnnouncementModalOpen}
        onCancel={handleCloseAnnouncementModal}
        footer={null}
        width={800}
      >
        <Form
          form={announcementForm}
          layout="vertical"
          onFinish={handleSubmitAnnouncement}
          autoComplete="off"
        >
          <Form.Item
            label="Titre"
            name="libelle"
            rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
          >
            <Input placeholder="Fête paroissiale ce dimanche" />
          </Form.Item>

          <Form.Item label="Contenu" name="contenu">
            <TextArea
              rows={6}
              placeholder="Rejoignez-nous pour notre fête paroissiale annuelle..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Type d'annonce" name="code_type">
                <Select
                  placeholder="Sélectionner"
                  showSearch
                  allowClear
                  options={announcementTypes?.map((t) => ({
                    label: t.libelle,
                    value: t.code,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Unité ecclésiale" name="code_unite_ecclesiale">
                <Select
                  placeholder="Sélectionner"
                  showSearch
                  allowClear
                  options={unitsResponse?.data.map((u) => ({
                    label: u.libelle,
                    value: u.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Date de publication" name="date_publication">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date d'expiration" name="date_expiration">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseAnnouncementModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createAnnouncement.isPending || updateAnnouncement.isPending}
              >
                {editingAnnouncement ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Announcement Type Modal */}
      <Modal
        title={editingType ? "Modifier le type d'annonce" : "Nouveau type d'annonce"}
        open={isTypeModalOpen}
        onCancel={handleCloseTypeModal}
        footer={null}
        width={600}
      >
        <Form
          form={typeForm}
          layout="vertical"
          onFinish={handleSubmitType}
          autoComplete="off"
        >
          <Form.Item
            label="Nom"
            name="libelle"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
          >
            <Input placeholder="Événement" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Annonces liées aux événements paroissiaux..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseTypeModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createType.isPending || updateType.isPending}
              >
                {editingType ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
