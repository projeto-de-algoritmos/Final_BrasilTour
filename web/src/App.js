import React, { useEffect, useMemo, useState } from "react";

import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Pane } from "react-leaflet";
import { 
  Flex,
  Box,
  useToast,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import Drawer from "./components/Drawer";
import api from "./services/api"


import icon from 'leaflet/dist/images/marker-icon.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
});

L.Marker.prototype.options.icon = DefaultIcon;


function App() {
  const toast = useToast();

  const [airports, setAirports] = useState([]);
  const [items, setItems] = useState([]);
  const [airportsTitles, setAirportsTitles] = useState([]);
  const [graph, setGraph] = useState([]);
  const [resultGraph, setResultGraph] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemWeight, setItemWeight] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [baggageWeight, setBaggageWeight] = useState("");

  const handleSourceChange = (e) => setSource(e.target.value);
  const handleDestinationChange = (e) => setDestination(e.target.value);
  const handleItemNameChange = (e) => setItemName(e.target.value);
  const handleItemWeightChange = (e) => setItemWeight(e.target.value);
  const handleItemValueChange = (e) => setItemValue(e.target.value);
  const handleBaggageWeightChange = (e) => setBaggageWeight(e.target.value);

  useEffect(() => {
    getAirports();
    getGraph();
  }, []);

  const getAirports = async () => {
    try {
      const { data } = await api.get("/airports");
      const titles = data.airports.map(el => el[0]);
      setAirportsTitles(titles);
      setAirports(data.airports);
    } catch {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color='white' p={3} bg='red.500'>
            Um erro ocorreu, contate um desenvolvedor
          </Box>
        ),
      })
    }
  };

  const getGraph = async () => {
    try {
      const { data } = await api.get("/graph");
      setGraph(data.graph);
    } catch {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color='white' p={3} bg='red.500'>
            Um erro ocorreu, contate um desenvolvedor
          </Box>
        ),
      })
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: pathData } = await api.post("/path", { source, destination });
      const { data: profitData } = await api.post("/profit", { 
        max_weight: baggageWeight, 
        weights: items.map(item => parseInt(item.weight)),
        values: items.map(item => parseInt(item.value))
      });
      setResultGraph(pathData.airports);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `O melhor caminho está foi encontrado com sucesso! E o lucro vendendo todas as mercadorias é ${profitData}`,
        showConfirmButton: false,
        timer: 3000
      })
    } catch {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Não foi possível encontrar o caminho desejado, tente outro',
        showConfirmButton: false,
        timer: 3000
      })
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setItems([...items, {
      name: itemName,
      weight: itemWeight,
      value: itemValue,
    }])
  };

  const lines = useMemo(() => {
    const lines = [];
    if (!graph || !airports) {
      return lines;
    }
    for (var node in graph) {
      const nodeResponse = airports.find(el => el[0] === node);
      if (!nodeResponse) {
        continue;
      }

      const [_, nodeLat, nodeLng] = nodeResponse;
      const nodeElements = graph[node];

      for (var i in nodeElements) {
        const nodeElementResponse = airports.find(el => el[0] === nodeElements[i]);

        if (!nodeElementResponse) {
          continue
        }

        const [_, nodeElLat, nodeElLng] = nodeElementResponse;
        lines.push([
          [nodeLat, nodeLng],
          [nodeElLat, nodeElLng]
        ])
      }
    }

    return lines
  }, [airports, graph]);

  const resultLines = useMemo(() => {
    const lines = [];
    if (!resultGraph || !airports) {
      return lines;
    }
    for (var index in resultGraph) {
      const node = resultGraph[index]
      const nodeResponse = airports.find(el => el[0] === node);
      if (!nodeResponse) {
        continue;
      }

      const [_, nodeLat, nodeLng] = nodeResponse;
      lines.push([nodeLat, nodeLng])
    }

    return lines
  }, [airports, resultGraph]);

  return (
    <Flex direction="row">
      {items.length != 0 && (
        <Box 
          width="25vw" 
          height="40vh" 
          position="absolute" 
          right={0} 
          bottom={0} 
          backgroundColor="white" 
          zIndex={100}
          alignItems="center"
          justifyContent="center"
        >
          <TableContainer>
            <Table variant='simple'>
              <TableCaption>Itens</TableCaption>
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Peso</Th>
                  <Th>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.name}</Td>
                    <Td>{item.weight}</Td>
                    <Td>{item.value}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box width="25vw">
        <Drawer
          handleSubmit={handleSubmit}
          handleAddItem={handleAddItem}
          handleDestinationChange={handleDestinationChange}
          handleSourceChange={handleSourceChange}
          airports={airportsTitles}
          handleItemNameChange={handleItemNameChange}
          handleItemWeightChange={handleItemWeightChange}
          handleItemValueChange={handleItemValueChange}
          handleBaggageWeightChange={handleBaggageWeightChange}
        />
      </Box>
      <Box flex="1" zIndex={1}>
        <MapContainer
          center={[51.505, -9.09]}
          zoom={3}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {airports.map((airport, index) => (
            <CircleMarker
              center={[airport[1], airport[2]]}
              color="blue"
              fill
              radius={5}

            >
              <Popup>{airport[0]}</Popup>
            </CircleMarker>
          ))}
          <div className="test2">
            {lines.map(line => (
              <Polyline color="black" positions={line} opacity={0.5} />
            ))}
          </div>
          <Pane name="result-line" style={{ zIndex: 500 }}>
            <Polyline
              color="red"
              positions={resultLines}
            />
          </Pane>
        </MapContainer>
      </Box>
    </Flex >
  );
}

export default App;
