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
  Card,
  Row,
  Col,
  Statistic,
  TimePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useConfessions,
  useCreateConfession,
  useUpdateConfession,
  useDeleteConfession,
  useConfessionStats,
} from '../lib/hooks/useConfessions';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { Confession } from '../lib/api/confessions';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const FREQUENCIES = [
  { value: 'daily', label: 'Quotidienne', color: 'blue' },
  { value: 'weekly', label: 'Hebdomadaire', color: 'green' },
  { value: 'monthly', label: 'Mensuelle', color: 'orange' },
  { value: 'on_demand', label: 'Sur rendez-vous', color: 'purple' },
];

export function ConfessionsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [frequencyFilter, setFrequencyFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: confessionsResponse, isLoading } = useConfessions({
    search: searchTerm || undefined,
    code_unite_ecclesiale: unitFilter,
    granularite: frequencyFilter,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: stats } = useConfessionStats();

  const createConfession = useCreateConfession();
  const updateConfession = useUpdateConfession();
  const deleteConfession = useDeleteConfession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfession, setEditingConfession] = useState<Confession | null>(null);
  const [form] = Form.useForm();

  const getFrequencyTag = (granularite?: string) => {
    const freq = FREQUENCIES.find((f) => f.value === granularite);
    return freq || { label: 'Non défini', color: 'default' };
  };

  const handleOpenModal = (confession?: Confession) => {
    if (confession) {
      setEditingConfession(confession);
      form.setFieldsValue({
        lieu: confession.lieu,
        horaire_debut: confession.horaire_debut ? dayjs(confession.horaire_debut, 'HH:mm:ss') : undefined,
        horaire_fin: confession.horaire_fin ? dayjs(confession.horaire_fin, 'HH:mm:ss') : undefined,
        granularite: confession.granularite,
        code_unite_ecclesiale: confession.code_unite_ecclesiale,
      });
    } else {
      setEditingConfession(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConfession(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const confessionData = {
        ...values,
        horaire_debut: values.horaire_debut ? values.horaire_debut.format('HH:mm') : undefined,
        horaire_fin: values.horaire_fin ? values.horaire_fin.format('HH:mm') : undefined,
      };

      if (editingConfession) {
        await updateConfession.mutateAsync({
          id: editingConfession.code,
          data: confessionData,
        });
        message.success('Horaire de confession modifié avec succès');
      } else {
        await createConfession.mutateAsync(confessionData);
        message.success('Horaire de confession créé avec succès');
      }
      handleCloseModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (confession: Confession) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer cet horaire de confession ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteConfession.mutateAsync(confession.code);
          message.success('Horaire supprimé avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cet horaire');
        }
      },
    });
  };

  const columns: ColumnsType<Confession> = [
    {
      title: 'Lieu',
      dataIndex: 'lieu',
      key: 'lieu',
      render: (lieu: string) => lieu ? (
        <Space>
          <EnvironmentOutlined style={{ color: '#1677ff' }} />
          <Text strong>{lieu}</Text>
        </Space>
      ) : '-',
    },
    {
      title: 'Horaire début',
      dataIndex: 'horaire_debut',
      key: 'horaire_debut',
      render: (horaire: string) => horaire ? (
        <Space size="small">
          <ClockCircleOutlined />
          {horaire.substring(0, 5)}
        </Space>
      ) : '-',
    },
    {
      title: 'Horaire fin',
      dataIndex: 'horaire_fin',
      key: 'horaire_fin',
      render: (horaire: string) => horaire ? (
        <Space size="small">
          <ClockCircleOutlined />
          {horaire.substring(0, 5)}
        </Space>
      ) : '-',
    },
    {
      title: 'Fréquence',
      dataIndex: 'granularite',
      key: 'granularite',
      render: (granularite: string) => {
        const freq = getFrequencyTag(granularite);
        return <Tag color={freq.color}>{freq.label}</Tag>;
      },
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
            Horaires de confession
          </Title>
          <Text type="secondary">Gérez les horaires de réconciliation</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Nouvel horaire
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Total des horaires"
                value={stats.total}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Quotidiennes"
                value={stats.byFrequency?.daily || 0}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Hebdomadaires"
                value={stats.byFrequency?.weekly || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Sur rendez-vous"
                value={stats.byFrequency?.on_demand || 0}
                valueStyle={{ color: '#722ed1' }}
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
          placeholder="Fréquence"
          style={{ width: 180 }}
          allowClear
          value={frequencyFilter}
          onChange={setFrequencyFilter}
          options={FREQUENCIES.map((f) => ({ label: f.label, value: f.value }))}
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
        dataSource={confessionsResponse?.data}
        rowKey="code"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: confessionsResponse?.meta.total,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} horaires`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingConfession ? 'Modifier l\'horaire' : 'Nouvel horaire de confession'}
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
          <Form.Item label="Lieu" name="lieu">
            <Input placeholder="Confessionnal principal" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Horaire début" name="horaire_debut">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Horaire fin" name="horaire_fin">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fréquence" name="granularite">
                <Select
                  placeholder="Sélectionner la fréquence"
                  options={FREQUENCIES.map((f) => ({ label: f.label, value: f.value }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createConfession.isPending || updateConfession.isPending}
              >
                {editingConfession ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
