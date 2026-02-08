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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  useActivityStats,
  useActivityTypes,
  useCreateActivityType,
  useUpdateActivityType,
  useDeleteActivityType,
} from '../lib/hooks/useActivities';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { Activity, ActivityType } from '../lib/api/activities';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const FREQUENCIES = [
  { value: 'once', label: 'Une fois' },
  { value: 'daily', label: 'Quotidienne' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'yearly', label: 'Annuelle' },
];

const STATUS_OPTIONS = [
  { value: 0, label: 'Planifiée', color: 'blue' },
  { value: 1, label: 'En cours', color: 'green' },
  { value: 2, label: 'Terminée', color: 'default' },
];

export function ActivitiesManagement() {
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: activitiesResponse, isLoading } = useActivities({
    search: searchTerm || undefined,
    code_type_activite: typeFilter,
    code_unite_ecclesiale: unitFilter,
    statut: statusFilter,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: activityTypes } = useActivityTypes();
  const { data: stats } = useActivityStats();

  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const createType = useCreateActivityType();
  const updateType = useUpdateActivityType();
  const deleteType = useDeleteActivityType();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingType, setEditingType] = useState<ActivityType | null>(null);
  const [activityForm] = Form.useForm();
  const [typeForm] = Form.useForm();

  const getFrequencyLabel = (frequence?: string) => {
    return FREQUENCIES.find((f) => f.value === frequence)?.label || 'Non défini';
  };

  const getStatusTag = (statut?: number) => {
    const status = STATUS_OPTIONS.find((s) => s.value === statut);
    return status || { label: 'Non défini', color: 'default' };
  };

  // Activity handlers
  const handleOpenActivityModal = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      activityForm.setFieldsValue({
        libelle: activity.libelle,
        date_activite: activity.date_activite ? dayjs(activity.date_activite) : undefined,
        description: activity.description,
        frequence: activity.frequence,
        date_debut: activity.date_debut ? dayjs(activity.date_debut) : undefined,
        date_fin: activity.date_fin ? dayjs(activity.date_fin) : undefined,
        statut: activity.statut,
        lieu: activity.lieu,
        code_unite_ecclesiale: activity.code_unite_ecclesiale,
        code_type_activite: activity.code_type_activite,
      });
    } else {
      setEditingActivity(null);
      activityForm.resetFields();
    }
    setIsActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    activityForm.resetFields();
  };

  const handleSubmitActivity = async (values: any) => {
    try {
      const activityData = {
        ...values,
        date_activite: values.date_activite ? values.date_activite.format('YYYY-MM-DD') : undefined,
        date_debut: values.date_debut ? values.date_debut.format('YYYY-MM-DD') : undefined,
        date_fin: values.date_fin ? values.date_fin.format('YYYY-MM-DD') : undefined,
      };

      if (editingActivity) {
        await updateActivity.mutateAsync({
          id: editingActivity.code,
          data: activityData,
        });
        message.success('Activité modifiée avec succès');
      } else {
        await createActivity.mutateAsync(activityData);
        message.success('Activité créée avec succès');
      }
      handleCloseActivityModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${activity.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteActivity.mutateAsync(activity.code);
          message.success('Activité supprimée avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cette activité');
        }
      },
    });
  };

  // Activity Type handlers
  const handleOpenTypeModal = (type?: ActivityType) => {
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
        message.success("Type d'activité modifié avec succès");
      } else {
        await createType.mutateAsync(values);
        message.success("Type d'activité créé avec succès");
      }
      handleCloseTypeModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteType = (type: ActivityType) => {
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

  const activityColumns: ColumnsType<Activity> = [
    {
      title: 'Nom',
      dataIndex: 'libelle',
      key: 'libelle',
      render: (libelle: string) => (
        <Space>
          <CalendarOutlined style={{ color: '#1677ff' }} />
          <Text strong>{libelle}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => record.activityType?.libelle || '-',
    },
    {
      title: 'Fréquence',
      dataIndex: 'frequence',
      key: 'frequence',
      render: (frequence: string) => getFrequencyLabel(frequence),
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut: number) => {
        const status = getStatusTag(statut);
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'Lieu',
      dataIndex: 'lieu',
      key: 'lieu',
      render: (lieu: string) => lieu ? (
        <Space size="small">
          <EnvironmentOutlined />
          {lieu}
        </Space>
      ) : '-',
    },
    {
      title: 'Unité ecclésiale',
      key: 'unit',
      render: (_, record) => record.ecclesiasticalUnit?.libelle || '-',
    },
    {
      title: 'Date',
      dataIndex: 'date_activite',
      key: 'date_activite',
      render: (date: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
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
            onClick={() => handleOpenActivityModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteActivity(record)}
          />
        </Space>
      ),
    },
  ];

  const typeColumns: ColumnsType<ActivityType> = [
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
            Gestion des activités
          </Title>
          <Text type="secondary">Gérez les activités paroissiales</Text>
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
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="À venir"
                value={stats.upcoming}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Passées"
                value={stats.past}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="En cours"
                value={stats.byStatus.ongoing}
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
            key: 'activities',
            label: 'Activités',
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
                      options={activityTypes?.map((t) => ({ label: t.libelle, value: t.code }))}
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
                      placeholder="Statut"
                      style={{ width: 130 }}
                      allowClear
                      value={statusFilter}
                      onChange={setStatusFilter}
                      options={STATUS_OPTIONS}
                    />
                  </Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenActivityModal()}
                  >
                    Nouvelle activité
                  </Button>
                </div>

                {/* Table */}
                <Table
                  columns={activityColumns}
                  dataSource={activitiesResponse?.data}
                  rowKey="code"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize,
                    total: activitiesResponse?.meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} activités`,
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
            label: "Types d'activités",
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
                  dataSource={activityTypes}
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

      {/* Activity Modal */}
      <Modal
        title={editingActivity ? "Modifier l'activité" : 'Nouvelle activité'}
        open={isActivityModalOpen}
        onCancel={handleCloseActivityModal}
        footer={null}
        width={800}
      >
        <Form
          form={activityForm}
          layout="vertical"
          onFinish={handleSubmitActivity}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nom"
                name="libelle"
                rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
              >
                <Input placeholder="Catéchisme" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date de l'activité" name="date_activite">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Description de l'activité..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Fréquence" name="frequence">
                <Select placeholder="Sélectionner" options={FREQUENCIES} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date début" name="date_debut">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Date fin" name="date_fin">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Statut" name="statut" initialValue={1}>
                <Select placeholder="Sélectionner" options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Lieu" name="lieu">
                <Input placeholder="Salle paroissiale" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Unité ecclésiale"
                name="code_unite_ecclesiale"
                rules={[{ required: true, message: "Veuillez sélectionner l'unité" }]}
              >
                <Select
                  placeholder="Sélectionner"
                  showSearch
                  options={unitsResponse?.data.map((u) => ({
                    label: u.libelle,
                    value: u.code,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Type d'activité" name="code_type_activite">
                <Select
                  placeholder="Sélectionner"
                  showSearch
                  allowClear
                  options={activityTypes?.map((t) => ({
                    label: t.libelle,
                    value: t.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseActivityModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createActivity.isPending || updateActivity.isPending}
              >
                {editingActivity ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Activity Type Modal */}
      <Modal
        title={editingType ? "Modifier le type d'activité" : "Nouveau type d'activité"}
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
            <Input placeholder="Catéchisme" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Description du type..." />
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
