import { 
  Box, 
  Flex, 
  Image, 
  Select, 
  Button, 
  Input
} from "@chakra-ui/react";
import logo from "../../assets/logo.jpeg"

export default function Drawer({
  handleDestinationChange,
  handleSourceChange,
  handleSubmit,
  handleAddItem,
  airports,
  handleItemValueChange,
  handleItemNameChange,
  handleItemWeightChange,
  handleBaggageWeightChange
}) {
  return (
    <Flex
      direction="column"
      align="center"
      height="100%"
      width="100%"
      justify="space-around"
    >
      <Box marginTop="40px">
        <Image src={logo} />
      </Box>

      <Box flex="1"
        width="100%"
        padding="30px"
      >
        <form onSubmit={handleSubmit}>
          <Flex
            direction="column"
            align="center"
            width="100%"
          >
            <Select
              placeholder="Onde você está?"
              marginBottom="40px"
              width="100%"
              onChange={handleSourceChange}
              required
            >
              {airports.map(airport => (
                <option value={airport}>{airport}</option>
              ))}
            </Select>
            <Select
              placeholder="Para onde quer ir?"
              marginBottom="40px"
              onChange={handleDestinationChange}
              required
            >
              {airports.map((airport, index) => (
                <option key={index} value={airport}>{airport}</option>
              ))}
            </Select>
            <Input 
              placeholder="Peso máximo de bagagem" 
              marginTop="40px"
              marginBottom="40px"
              onChange={handleBaggageWeightChange}
            />
            <Button
              colorScheme="blue"
              isFullWidth
              type="submit"
            >
              Pesquisar
            </Button>
          </Flex>
        </form>
        <form onSubmit={handleAddItem}>
          <Flex
            direction="column"
            align="center"
            width="100%"
          >
            <Input 
              placeholder="Nome do item" 
              marginTop="40px"
              marginBottom="40px"
              onChange={handleItemNameChange}
            />
            <Input 
              placeholder="Peso do item" 
              marginBottom="40px"
              onChange={handleItemWeightChange}
            />
            <Input 
              placeholder="Valor do item" 
              marginBottom="40px"
              onChange={handleItemValueChange}
            />
            <Button
              colorScheme="blue"
              isFullWidth
              type="submit"
            >
              Adicionar
            </Button>
          </Flex>
        </form>
      </Box >
    </Flex >
  );
}