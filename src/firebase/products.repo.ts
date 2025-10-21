import { db } from '@firebase/index';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { ProductEntity } from '@store/slices/products.slice';

const productsCol = collection(db, 'products');

export async function addProduct(data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  const docRef = await addDoc(productsCol, { ...data, createdAt: now, updatedAt: now });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<ProductEntity>) {
  const ref = doc(db, 'products', id);
  await updateDoc(ref, { ...data, updatedAt: new Date() });
}

export async function deleteProduct(id: string) {
  const ref = doc(db, 'products', id);
  await deleteDoc(ref);
}

export function subscribeProducts(cb: (products: ProductEntity[], removedIds: string[]) => void, errorCb?: (error: Error) => void) {
  return onSnapshot(productsCol, (snapshot: QuerySnapshot) => {
    const products: ProductEntity[] = [];
    const removed: string[] = [];
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        removed.push(change.doc.id);
      } else if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data() as any;
        const createdAt = data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(data.createdAt)) : undefined;
        const updatedAt = data.updatedAt ? (data.updatedAt.seconds ? new Date(data.updatedAt.seconds * 1000) : new Date(data.updatedAt)) : undefined;
        
        products.push({
          id: change.doc.id,
          name: data.name,
          sku: data.sku,
          price: data.price,
          quantity: data.quantity,
          status: data.status,
          category: data.category,
          createdAt: createdAt?.toISOString(),
          updatedAt: updatedAt?.toISOString(),
        });
      }
    });
    cb(products, removed);
  }, (error) => {
    if (errorCb) errorCb(error);
  });
}
