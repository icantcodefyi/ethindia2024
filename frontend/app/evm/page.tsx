"use client";
import Header from "@/components/Header";
import { BlockchainWorkflow } from '@/components/WorkflowBlockchain';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Header />
        <BlockchainWorkflow />
      </div>
    </DndProvider>
  );
}
