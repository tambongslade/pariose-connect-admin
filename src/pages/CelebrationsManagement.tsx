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
  TimePicker,
  InputNumber,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useCelebrations,
  useCreateCelebration,
  useUpdateCelebration,
  useDeleteCelebration,
  useCelebrationStats,
  useMassIntentions,
  useCreateMassIntention,
  useUpdateMassIntention,
  useDeleteMassIntention,
} from '../lib/hooks/useCelebrations';
import { useEcclesiasticalUnits } from '../lib/hooks/useEcclesiasticalUnits';
import type { Celebration, MassIntention } from '../lib/api/celebrations';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CELEBRATION_TYPES = [
  { value: 'regular', label: 'Régulière', color: 'blue' },
  { value: 'special', label: 'Spéciale', color: 'purple' },
  { value: 'feast', label: 'Fête', color: 'gold' },
  { value: 'wedding', label: 'Mariage', color: 'pink' },
  { value: 'funeral', label: 'Funérailles', color: 'default' },
  { value: 'baptism', label: 'Baptême', color: 'cyan' },
];

const FREQUENCIES = [
  { value: 'daily', label: 'Quotidienne' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'yearly', label: 'Annuelle' },
  { value: 'once', label: 'Une fois' },
];

export function CelebrationsManagement() {
  const [activeTab, setActiveTab] = useState('celebrations');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [unitFilter, setUnitFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: celebrationsResponse, isLoading } = useCelebrations({
    search: searchTerm || undefined,
    code_type: typeFilter,
    code_unite_ecclesiale: unitFilter,
    page,
    limit: pageSize,
  });

  const { data: unitsResponse } = useEcclesiasticalUnits({ limit: 100 });
  const { data: stats } = useCelebrationStats();
  const { data: massIntentions } = useMassIntentions();

  const createCelebration = useCreateCelebration();
  const updateCelebration = useUpdateCelebration();
  const deleteCelebration = useDeleteCelebration();

  const createIntention = useCreateMassIntention();
  const updateIntention = useUpdateMassIntention();
  const deleteIntention = useDeleteMassIntention();

  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [editingCelebration, setEditingCelebration] = useState<Celebration | null>(null);
  const [editingIntention, setEditingIntention] = useState<MassIntention | null>(null);
  const [celebrationForm] = Form.useForm();
  const [intentionForm] = Form.useForm();

  const getTypeTag = (type?: string) => {
    const typeConfig = CELEBRATION_TYPES.find((t) => t.value === type);
    return typeConfig || { label: 'Non défini', color: 'default' };
  };

  const getFrequencyLabel = (granularite?: string) => {
    return FREQUENCIES.find((f) => f.value === granularite)?.label || 'Non défini';
  };

  // Celebration handlers
  const handleOpenCelebrationModal = (celebration?: Celebration) => {
    if (celebration) {
      setEditingCelebration(celebration);
      celebrationForm.setFieldsValue({
        libelle: celebration.libelle,
        granularite: celebration.granularite,
        code_horaire: celebration.code_horaire ? dayjs(celebration.code_horaire, 'HH:mm') : undefined,
        code_type: celebration.code_type,
        code_unite_ecclesiale: celebration.code_unite_ecclesiale,
      });
    } else {
      setEditingCelebration(null);
      celebrationForm.resetFields();
    }
    setIsCelebrationModalOpen(true);
  };

  const handleCloseCelebrationModal = () => {
    setIsCelebrationModalOpen(false);
    setEditingCelebration(null);
    celebrationForm.resetFields();
  };

  const handleSubmitCelebration = async (values: any) => {
    try {
      const celebrationData = {
        ...values,
        code_horaire: values.code_horaire ? values.code_horaire.format('HH:mm') : undefined,
      };

      if (editingCelebration) {
        await updateCelebration.mutateAsync({
          id: editingCelebration.code,
          data: celebrationData,
        });
        message.success('Célébration modifiée avec succès');
      } else {
        await createCelebration.mutateAsync(celebrationData);
        message.success('Célébration créée avec succès');
      }
      handleCloseCelebrationModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteCelebration = (celebration: Celebration) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: `Êtes-vous sûr de vouloir supprimer "${celebration.libelle}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteCelebration.mutateAsync(celebration.code);
          message.success('Célébration supprimée avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cette célébration');
        }
      },
    });
  };

  // Mass Intention handlers
  const handleOpenIntentionModal = (intention?: MassIntention) => {
    if (intention) {
      setEditingIntention(intention);
      intentionForm.setFieldsValue({
        intention_messe: intention.intention_messe,
        code_celebration_eucharistique: intention.code_celebration_eucharistique,
        montant_verse: intention.montant_verse ? parseFloat(intention.montant_verse) : undefined,
        date_versement: intention.date_versement ? dayjs(intention.date_versement) : undefined,
      });
    } else {
      setEditingIntention(null);
      intentionForm.resetFields();
    }
    setIsIntentionModalOpen(true);
  };

  const handleCloseIntentionModal = () => {
    setIsIntentionModalOpen(false);
    setEditingIntention(null);
    intentionForm.resetFields();
  };

  const handleSubmitIntention = async (values: any) => {
    try {
      const intentionData = {
        ...values,
        date_versement: values.date_versement ? values.date_versement.format('YYYY-MM-DD') : undefined,
      };

      if (editingIntention) {
        await updateIntention.mutateAsync({
          id: editingIntention.code,
          data: intentionData,
        });
        message.success('Intention de messe modifiée avec succès');
      } else {
        await createIntention.mutateAsync(intentionData);
        message.success('Intention de messe créée avec succès');
      }
      handleCloseIntentionModal();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDeleteIntention = (intention: MassIntention) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cette intention de messe ?',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      async onOk() {
        try {
          await deleteIntention.mutateAsync(intention.code);
          message.success('Intention supprimée avec succès');
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Impossible de supprimer cette intention');
        }
      },
    });
  };

  const celebrationColumns: ColumnsType<Celebration> = [
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
      dataIndex: 'code_type',
      key: 'code_type',
      render: (code_type: string) => {
        const typeTag = getTypeTag(code_type);
        return <Tag color={typeTag.color}>{typeTag.label}</Tag>;
      },
    },
    {
      title: 'Fréquence',
      dataIndex: 'granularite',
      key: 'granularite',
      render: (granularite: string) => getFrequencyLabel(granularite),
    },
    {
      title: 'Horaire',
      dataIndex: 'code_horaire',
      key: 'code_horaire',
      render: (code_horaire: string) => (
        code_horaire ? (
          <Space size="small">
            <ClockCircleOutlined />
            {code_horaire}
          </Space>
        ) : '-'
      ),
    },
    {
      title: 'Unité ecclésiale',
      key: 'unit',
      render: (_, record) => record.ecclesiasticalUnit?.libelle || '-',
    },
    {
      title: 'Intentions',
      key: 'intentions',
      render: (_, record) => (
        <Tag color="purple">{record.intentions?.length || 0}</Tag>
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
            onClick={() => handleOpenCelebrationModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCelebration(record)}
          />
        </Space>
      ),
    },
  ];

  const intentionColumns: ColumnsType<MassIntention> = [
    {
      title: 'Intention',
      dataIndex: 'intention_messe',
      key: 'intention_messe',
      render: (intention: string) => (
        <Space>
          <HeartOutlined style={{ color: '#ff4d4f' }} />
          <Text>{intention}</Text>
        </Space>
      ),
    },
    {
      title: 'Célébration',
      key: 'celebration',
      render: (_, record) => record.celebration?.libelle || '-',
    },
    {
      title: 'Montant versé',
      dataIndex: 'montant_verse',
      key: 'montant_verse',
      render: (montant: string) => montant ? `${parseFloat(montant).toLocaleString()} FCFA` : '-',
    },
    {
      title: 'Date de versement',
      dataIndex: 'date_versement',
      key: 'date_versement',
      render: (date: string) => date ? new Date(date).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Créé par',
      key: 'creator',
      render: (_, record) => {
        const creator = record.creator;
        return creator ? `${creator.prenoms} ${creator.noms}` : '-';
      },
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
            onClick={() => handleOpenIntentionModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteIntention(record)}
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
            Gestion des célébrations
          </Title>
          <Text type="secondary">Gérez les messes et intentions</Text>
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
                title="Intentions"
                value={massIntentions?.length || 0}
                prefix={<HeartOutlined />}
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
            key: 'celebrations',
            label: 'Célébrations',
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
                      style={{ width: 150 }}
                      allowClear
                      value={typeFilter}
                      onChange={setTypeFilter}
                      options={CELEBRATION_TYPES.map((t) => ({ label: t.label, value: t.value }))}
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
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenCelebrationModal()}
                  >
                    Nouvelle célébration
                  </Button>
                </div>

                {/* Table */}
                <Table
                  columns={celebrationColumns}
                  dataSource={celebrationsResponse?.data}
                  rowKey="code"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize,
                    total: celebrationsResponse?.meta.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} célébrations`,
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
            key: 'intentions',
            label: 'Intentions de messe',
            children: (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenIntentionModal()}
                  >
                    Nouvelle intention
                  </Button>
                </div>

                <Table
                  columns={intentionColumns}
                  dataSource={massIntentions}
                  rowKey="code"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total} intentions`,
                  }}
                />
              </div>
            ),
          },
        ]}
      />

      {/* Celebration Modal */}
      <Modal
        title={editingCelebration ? 'Modifier la célébration' : 'Nouvelle célébration'}
        open={isCelebrationModalOpen}
        onCancel={handleCloseCelebrationModal}
        footer={null}
        width={700}
      >
        <Form
          form={celebrationForm}
          layout="vertical"
          onFinish={handleSubmitCelebration}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nom"
                name="libelle"
                rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
              >
                <Input placeholder="Messe du dimanche" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Horaire" name="code_horaire">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Type" name="code_type">
                <Select
                  placeholder="Sélectionner le type"
                  options={CELEBRATION_TYPES.map((t) => ({ label: t.label, value: t.value }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Fréquence" name="granularite">
                <Select placeholder="Sélectionner la fréquence" options={FREQUENCIES} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Unité ecclésiale"
            name="code_unite_ecclesiale"
            rules={[{ required: true, message: "Veuillez sélectionner l'unité ecclésiale" }]}
          >
            <Select
              placeholder="Sélectionner l'unité"
              showSearch
              options={unitsResponse?.data.map((u) => ({
                label: u.libelle,
                value: u.code,
              }))}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseCelebrationModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createCelebration.isPending || updateCelebration.isPending}
              >
                {editingCelebration ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Mass Intention Modal */}
      <Modal
        title={editingIntention ? "Modifier l'intention" : 'Nouvelle intention de messe'}
        open={isIntentionModalOpen}
        onCancel={handleCloseIntentionModal}
        footer={null}
        width={600}
      >
        <Form
          form={intentionForm}
          layout="vertical"
          onFinish={handleSubmitIntention}
          autoComplete="off"
        >
          <Form.Item
            label="Célébration"
            name="code_celebration_eucharistique"
            rules={[{ required: true, message: 'Veuillez sélectionner la célébration' }]}
          >
            <Select
              placeholder="Sélectionner la célébration"
              showSearch
              options={celebrationsResponse?.data.map((c) => ({
                label: `${c.libelle} - ${c.code_horaire || ''}`,
                value: c.code,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Intention"
            name="intention_messe"
            rules={[{ required: true, message: "Veuillez saisir l'intention" }]}
          >
            <TextArea
              rows={3}
              placeholder="Pour le repos de l'âme de..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Montant versé (FCFA)" name="montant_verse">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="5000"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date de versement" name="date_versement">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseIntentionModal}>Annuler</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createIntention.isPending || updateIntention.isPending}
              >
                {editingIntention ? 'Modifier' : 'Créer'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
