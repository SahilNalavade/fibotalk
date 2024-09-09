import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Heading,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  IconButton,
  Tooltip,
  Select,
  TableContainer,
  LinkBox,
  LinkOverlay,
  Button,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaThList, FaTh, FaSync, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatDistanceToNow, parseISO } from 'date-fns';
import TopNav from './TopNav'; // Your TopNav component
import SideNav from './SideNav'; // Your SideNav component
import { useAuth } from '../auth'; // Your authentication hook
import DetailedPage from './DetailedPage'; // Your detailed page component

// Replace these constants with your actual Airtable credentials
const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
const AIRTABLE_TABLE_NAME = 'SavedReports';

// Fetch reports from Airtable
const fetchReportsFromAirtable = async () => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    const data = await response.json();
    return data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error('Error fetching reports from Airtable:', error);
    return [];
  }
};

// Function to delete a report from Airtable
const deleteReportFromAirtable = async (recordId) => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete report: ${response.statusText}`);
    }

    console.log(`Report ${recordId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting report from Airtable:', error);
  }
};

// ReportTile component to display each report in a tile view
const ReportTile = ({ report, onReportClick }) => {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      shadow="sm"
      position="relative"
      _hover={{
        '& .tile-actions': {
          opacity: 1,
        },
      }}
      onClick={() => onReportClick(report)}
    >
      <VStack align="start" spacing={2}>
        <Heading size="md">{report['Report Name']}</Heading>
        <Text fontSize="sm">
          Date: {report['Created At'] ? formatDistanceToNow(parseISO(report['Created At']), { addSuffix: true }) : 'Unknown'}
        </Text>
        <Badge
          colorScheme={
            report.Status === 'Verified'
              ? 'green'
              : report.Status === 'Training data'
              ? 'yellow'
              : 'red'
          }
        >
          {report.Status}
        </Badge>
        <Text fontSize="sm">{report['Report Description'] || 'No Description'}</Text>
      </VStack>
      <HStack
        spacing={2}
        position="absolute"
        top={2}
        right={2}
        opacity={0}
        className="tile-actions"
        transition="opacity 0.3s ease"
      >
        <Tooltip label="Refresh" aria-label="Refresh">
          <IconButton
            icon={<FaSync />}
            aria-label="Refresh"
            size="sm"
            variant="ghost"
          />
        </Tooltip>
        <Tooltip label="Delete" aria-label="Delete">
          <IconButton
            icon={<FaTrash />}
            aria-label="Delete"
            size="sm"
            variant="ghost"
            colorScheme="red"
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};

// Component to display the list of reports with pagination and refresh
const ReportList = ({ reports, onReportClick, onDelete, onRefresh }) => {
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingReportId, setLoadingReportId] = useState(null);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = reports.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRefreshClick = async (report) => {
    setLoadingReportId(report.id);
    await onRefresh(report);
    setLoadingReportId(null);
  };

  const getPendingSince = (createdAt) => {
    if (!createdAt) return 'N/A';
    try {
      return `Pending since ${formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}`;
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Box>
      {reports.length === 0 ? (
        <Text>No reports available.</Text>
      ) : (
        <TableContainer boxShadow="lg" borderRadius="lg">
          <Table variant="simple" size="md">
            <Thead bg="gray.100">
              <Tr>
                <Th fontSize="md">Report Name</Th>
                <Th fontSize="md">Requested By</Th>
                <Th fontSize="md">Pending Since</Th>
                <Th fontSize="md">Short Description</Th>
                <Th fontSize="md"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((report, index) => (
                <Tr
                  key={index}
                  _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
                  onClick={() => onReportClick(report)}
                >
                  <Td fontWeight="medium">
                    <LinkBox>
                      <LinkOverlay href="#" onClick={(e) => e.preventDefault()}>
                        {report['Report Name'] || 'Unnamed Report'}
                      </LinkOverlay>
                    </LinkBox>
                  </Td>
                  <Td>{report['User ID'] || 'Unknown'}</Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {getPendingSince(report['Created At'])}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {report['Report Description'] || 'No Description'}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2} justifyContent="flex-end">
                      <Tooltip label="Refresh" aria-label="Refresh">
                        <IconButton
                          icon={
                            loadingReportId === report.id ? (
                              <FaSync className="fa-spin" />
                            ) : (
                              <FaSync />
                            )
                          }
                          aria-label="Refresh"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefreshClick(report);
                          }}
                          isLoading={loadingReportId === report.id}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" aria-label="Delete">
                        <IconButton
                          icon={<FaTrash />}
                          aria-label="Delete"
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(report);
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {reports.length > itemsPerPage && (
        <Flex justifyContent="space-between" alignItems="center" mt={6}>
          <Text fontSize="sm" color="gray.600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, reports.length)} of {reports.length} results
          </Text>
          <ButtonGroup variant="outline" spacing={2}>
            <Button
              leftIcon={<FaChevronLeft />}
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages).keys()].map((page) => (
              <Button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                variant={currentPage === page + 1 ? 'solid' : 'outline'}
                colorScheme={currentPage === page + 1 ? 'blue' : 'gray'}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              rightIcon={<FaChevronRight />}
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      )}
    </Box>
  );
};

// Component to toggle between list and tile views of reports
const ReportTab = ({ title, reports, onBreadcrumbUpdate, onReportClick, onDelete, onRefresh }) => {
  const [isListView, setIsListView] = useState(true);
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const inactiveColor = useColorModeValue('gray.400', 'gray.600');

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">{title}</Heading>
        <Flex>
          <Tooltip label="List view">
            <IconButton
              icon={<FaThList />}
              aria-label="List view"
              mr={2}
              onClick={() => setIsListView(true)}
              color={isListView ? activeColor : inactiveColor}
              variant="ghost"
            />
          </Tooltip>
          <Tooltip label="Tile view">
            <IconButton
              icon={<FaTh />}
              aria-label="Tile view"
              onClick={() => setIsListView(false)}
              color={!isListView ? activeColor : inactiveColor}
              variant="ghost"
            />
          </Tooltip>
        </Flex>
      </Flex>
      {isListView ? (
        <ReportList
          reports={reports}
          onReportClick={onReportClick}
          onDelete={onDelete}
          onRefresh={onRefresh}
        />
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {reports.map((report, index) => (
            <ReportTile key={index} report={report} onReportClick={onReportClick} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

const Reports = () => {
  const { isSignedIn } = useAuth();
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');

  const [breadcrumbItems, setBreadcrumbItems] = useState([{ label: 'Reports', href: '/' }]);
  const [pendingReports, setPendingReports] = useState([]);
  const [completedReports, setCompletedReports] = useState([]);
  const [inProgressReports, setInProgressReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const cancelRef = useRef();

  useEffect(() => {
    const loadReports = async () => {
      const reports = await fetchReportsFromAirtable();
      setPendingReports(reports.filter((report) => report.Status === 'Pending'));
      setCompletedReports(reports.filter((report) => report.Status === 'Verified'));
      setInProgressReports(reports.filter((report) => report.Status === 'Training data'));
    };

    loadReports();
  }, []);

  const handleTabChange = (index) => {
    const tabLabels = ['Pending', 'Verified', 'Training Data'];
    setBreadcrumbItems([{ label: 'Reports', href: '/' }, { label: tabLabels[index], href: '#' }]);
  };

  const handleBreadcrumbUpdate = (reportName) => {
    setBreadcrumbItems([{ label: 'Reports', href: '/' }, { label: reportName, href: '#' }]);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    handleBreadcrumbUpdate(report['Report Name']);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteReportFromAirtable(reportToDelete.id);

    // Update local state
    setPendingReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
    setCompletedReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
    setInProgressReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));

    setIsDeleteOpen(false);
    setReportToDelete(null);
    setDeleteConfirmationText('');
  };

  const handleRefreshReport = async (report) => {
    // Fetch updated data for the reports
    const refreshedReports = await fetchReportsFromAirtable();
    setPendingReports(refreshedReports.filter((r) => r.Status === 'Pending'));
    setCompletedReports(refreshedReports.filter((r) => r.Status === 'Verified'));
    setInProgressReports(refreshedReports.filter((r) => r.Status === 'Training data'));
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '105px' }}>
          {selectedReport ? (
            <DetailedPage report={selectedReport} />
          ) : (
            <Box maxWidth="90%" mx="auto" rounded="md">
              <Box mt={4}>
                <Breadcrumb
                  spacing="8px"
                  separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                  fontSize="lg"
                  color={breadcrumbColor}
                  mb={14}
                >
                  {breadcrumbItems.map((item, index) => (
                    <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbItems.length - 1}>
                      {index === breadcrumbItems.length - 1 ? (
                        <Text fontWeight="semibold" fontSize="lg">
                          {item.label}
                        </Text>
                      ) : (
                        <BreadcrumbLink href={item.href} fontSize="lg">
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>
              </Box>

              <Tabs colorScheme="blue" isLazy onChange={handleTabChange}>
                <TabList>
                  <Tab>
                    <Flex alignItems="center">
                      Pending
                      <Badge ml={2} colorScheme="blue" borderRadius={9}>
                        {pendingReports.length}
                      </Badge>
                    </Flex>
                  </Tab>
                  <Tab>
                    <Flex alignItems="center">
                      Verified
                      <Badge ml={2} colorScheme="blue" borderRadius={9}>
                        {completedReports.length}
                      </Badge>
                    </Flex>
                  </Tab>
                  <Tab>
                    <Flex alignItems="center">
                      Training Data
                      <Badge ml={2} colorScheme="blue" borderRadius={9}>
                        {inProgressReports.length}
                      </Badge>
                    </Flex>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <ReportTab
                      title="Pending Reports"
                      reports={pendingReports}
                      onReportClick={handleReportClick}
                      onDelete={handleDeleteClick}
                      onRefresh={handleRefreshReport}
                      onBreadcrumbUpdate={handleBreadcrumbUpdate}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ReportTab
                      title="Verified Reports"
                      reports={completedReports}
                      onReportClick={handleReportClick}
                      onDelete={handleDeleteClick}
                      onRefresh={handleRefreshReport}
                      onBreadcrumbUpdate={handleBreadcrumbUpdate}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ReportTab
                      title="Training Data Reports"
                      reports={inProgressReports}
                      onReportClick={handleReportClick}
                      onDelete={handleDeleteClick}
                      onRefresh={handleRefreshReport}
                      onBreadcrumbUpdate={handleBreadcrumbUpdate}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text mb={4}>Are you sure you want to delete this report? This action cannot be undone.</Text>
              <Text>Please type <strong>delete</strong> to confirm.</Text>
              <input
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Type delete to confirm"
                style={{ width: '100%', padding: '8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteOpen(false)}
                bg="white"
                border="1px solid"
                borderColor="#32343A"
                color="#32343A"
                _hover={{ bg: '#f7f7f7' }}
                _active={{ bg: '#e2e2e2' }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                bg="#32343A"
                color="white"
                _hover={{ bg: '#2b2d33' }}
                _active={{ bg: '#232529' }}
                isDisabled={deleteConfirmationText !== 'delete'}
              >
                Yes, Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default Reports;
